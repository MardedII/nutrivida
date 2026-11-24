package com.nutrivida.usuarios.config;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import com.nutrivida.usuarios.repository.UsuarioRepository;
import com.nutrivida.usuarios.service.UsuarioService;
import com.nutrivida.usuarios.dto.UsuarioRequest;
@Configuration public class AdminInicial {
 @Bean ApplicationRunner admin(UsuarioRepository repo,UsuarioService service,@Value("${app.admin.password}") String password){return args->{if(!password.isBlank()&&repo.findByCorreo("admin@nutrivida.cl").isEmpty())service.crear(new UsuarioRequest("Administrador NutriVida","11111111-1","admin@nutrivida.cl","+56 9 1111 1111","admin",password,password,true,null,null,null,null,false),false);};}
}