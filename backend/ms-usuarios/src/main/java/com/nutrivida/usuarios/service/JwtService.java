package com.nutrivida.usuarios.service;
import java.time.Instant;
import java.nio.charset.StandardCharsets;
import javax.crypto.spec.SecretKeySpec;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.stereotype.Service;
import com.nutrivida.usuarios.model.Usuario;
@Service public class JwtService {
 private final JwtEncoder encoder;
 public JwtService(@Value("${app.jwt.secret}") String secret){encoder=new NimbusJwtEncoder(new ImmutableSecret<>(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),"HmacSHA256")));}
 public String emitir(Usuario u){var now=Instant.now();var b=JwtClaimsSet.builder().issuer("nutrivida").subject(u.getId().toString()).issuedAt(now).expiresAt(now.plusSeconds(3600)).claim("rol",u.getRol()).claim("ver",u.getVersionSesion());if(u.getPerfilId()!=null)b.claim("perfilId",u.getPerfilId());return encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(),b.build())).getTokenValue();}
}