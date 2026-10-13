package com.shareplate.backend.config;

import com.shareplate.backend.model.Food;
import com.shareplate.backend.model.User;
import com.shareplate.backend.repository.FoodRepository;
import com.shareplate.backend.repository.UserRepository;
import com.shareplate.backend.service.PasswordService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(
            FoodRepository foodRepository,
            UserRepository userRepository,
            PasswordService passwordService
    ) {
        return args -> {
            if (foodRepository.count() == 0) {
                foodRepository.save(new Food(
                        "Vegetable Rice & Curry",
                        "Campus Canteen",
                        "20 meals",
                        "College Campus, Pune",
                        LocalDateTime.now().plusHours(5),
                        "Available"
                ));

                foodRepository.save(new Food(
                        "Fresh Vegetable Sandwiches",
                        "Green Cafe",
                        "12 meals",
                        "Kothrud, Pune",
                        LocalDateTime.now().plusHours(3),
                        "Available"
                ));

                foodRepository.save(new Food(
                        "Chapati and Dal",
                        "Community Kitchen",
                        "30 meals",
                        "Shivajinagar, Pune",
                        LocalDateTime.now().plusHours(7),
                        "Available"
                ));
            }

            if (userRepository.count() == 0) {
                // Seed Demo NGO
                String ngoSalt = passwordService.generateSalt();
                String ngoHash = passwordService.hashPassword("ngo123", ngoSalt);
                userRepository.save(new User(
                        "Pune Food Relief NGO",
                        "ngo@shareplate.org",
                        ngoHash,
                        ngoSalt,
                        "NGO",
                        "Food Relief Foundation",
                        true
                ));

                // Seed Demo Volunteer
                String volSalt = passwordService.generateSalt();
                String volHash = passwordService.hashPassword("volunteer123", volSalt);
                userRepository.save(new User(
                        "Kunal Volunteer",
                        "volunteer@shareplate.org",
                        volHash,
                        volSalt,
                        "VOLUNTEER",
                        "Youth Seva Club",
                        true
                ));

                // Seed Demo Donor
                String donorSalt = passwordService.generateSalt();
                String donorHash = passwordService.hashPassword("donor123", donorSalt);
                userRepository.save(new User(
                        "Campus Canteen Donor",
                        "canteen@shareplate.org",
                        donorHash,
                        donorSalt,
                        "DONOR",
                        "Campus Foods",
                        true
                ));
            }
        };
    }
}
