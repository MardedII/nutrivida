package com.nutrivida.citas.controller;

import com.nutrivida.citas.service.CitaService;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/internal/citas") public class AsignacionController {
    private final CitaService service;public AsignacionController(CitaService service){this.service=service;}
    @GetMapping("/asignacion/{nutri}/{paciente}") public boolean asignado(@PathVariable Long nutri,@PathVariable Long paciente){return service.asignado(nutri,paciente);}
}
