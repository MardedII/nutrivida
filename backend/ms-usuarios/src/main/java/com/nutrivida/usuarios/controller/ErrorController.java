package com.nutrivida.usuarios.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.dao.DataIntegrityViolationException;
import java.util.Map;
@RestControllerAdvice public class ErrorController {
 @ExceptionHandler(DataIntegrityViolationException.class) public ResponseEntity<Map<String,String>> duplicado(){return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message","Correo, RUT o perfil duplicado"));}
}
