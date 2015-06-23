package com.ncsoftworks.barcode.scanner.poc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * Created by ncavallo on 5/18/2015.
 */
@Configuration
@EnableAutoConfiguration
@ComponentScan(basePackages = "com.ncsoftworks.barcode.scanner.poc.controller")
public class Application {
    public static void main(String[] args) throws Exception {
        SpringApplication.run(Application.class, args);
    }
}
