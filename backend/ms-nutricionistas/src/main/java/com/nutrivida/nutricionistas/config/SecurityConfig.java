package com.nutrivida.nutricionistas.config;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;
import javax.crypto.spec.SecretKeySpec;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.web.filter.OncePerRequestFilter;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import org.springframework.web.client.RestClient;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
@Configuration
@SecurityScheme(name="bearerAuth",type=SecuritySchemeType.HTTP,scheme="bearer",bearerFormat="JWT")
public class SecurityConfig {
 private record Account(Boolean activo,String rol,String versionSesion) {}
 @Bean JwtDecoder jwtDecoder(@Value("${app.jwt.secret}") String secret, @Value("${servicios.usuarios.url}") String usuarios, @Value("${app.internal.secret}") String internal) {
  if(secret.getBytes(StandardCharsets.UTF_8).length<32) throw new IllegalStateException("JWT_SECRET debe tener al menos 32 bytes");
  var decoder=NimbusJwtDecoder.withSecretKey(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),"HmacSHA256")).macAlgorithm(MacAlgorithm.HS256).build();
  OAuth2TokenValidator<Jwt> accountValidator=jwt -> {
   try { if(validAccount(jwt, usuarios, internal)) return OAuth2TokenValidatorResult.success(); } catch(RuntimeException e) { /* fail closed */ }
   return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token","Cuenta inactiva, sesión revocada o servicio no disponible",null));
  };
  decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(JwtValidators.createDefaultWithIssuer("nutrivida"),accountValidator));
  return decoder;
 }
 private boolean validAccount(Jwt jwt, String usuarios, String internal) { var factory=new SimpleClientHttpRequestFactory(); factory.setConnectTimeout(3000);factory.setReadTimeout(5000);
 var account=RestClient.builder().requestFactory(factory).build().get().uri(usuarios+"/internal/usuarios/{id}",jwt.getSubject()).header("X-Internal-Key",internal).retrieve().body(Account.class);
 return account!=null && Boolean.TRUE.equals(account.activo()) && account.rol().equalsIgnoreCase(jwt.getClaimAsString("rol")) && java.util.Objects.equals(account.versionSesion(),jwt.getClaimAsString("ver")); }
 @Bean SecurityFilterChain security(HttpSecurity http,@Value("${app.internal.secret}") String internal) throws Exception {
  if(internal.length()<32) throw new IllegalStateException("INTERNAL_SECRET debe tener al menos 32 caracteres");
  var converter=new JwtAuthenticationConverter();
  converter.setJwtGrantedAuthoritiesConverter(jwt -> List.of(new SimpleGrantedAuthority("ROLE_"+jwt.getClaimAsString("rol").toUpperCase(java.util.Locale.ROOT))));
  http.cors(org.springframework.security.config.Customizer.withDefaults()).csrf(c->c.disable())
   .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
   .headers(h->h.frameOptions(f->f.sameOrigin()))
   .addFilterBefore(new OncePerRequestFilter() {
    @Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain) throws java.io.IOException,ServletException {
     String key=req.getHeader("X-Internal-Key");
     if(key!=null) {
      if(!MessageDigest.isEqual(internal.getBytes(StandardCharsets.UTF_8),key.getBytes(StandardCharsets.UTF_8))) {res.sendError(401);return;}
      SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("service",null,List.of(new SimpleGrantedAuthority("ROLE_SERVICE"))));
     }
     chain.doFilter(req,res);
    }
   },BearerTokenAuthenticationFilter.class)
   .authorizeHttpRequests(a->a.requestMatchers("/h2-console/**","/swagger-ui/**","/swagger-ui.html","/v3/api-docs/**","/error").permitAll()
    .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()
 .requestMatchers(HttpMethod.GET,"/api/nutricionistas/catalogo").permitAll()
 .requestMatchers("/api/nutricionistas/**").hasRole("SERVICE")
    .anyRequest().denyAll())
   .oauth2ResourceServer(o->o.jwt(j->j.jwtAuthenticationConverter(converter)));
  return http.build();
 }
}
