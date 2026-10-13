package com.shareplate.backend.controller;

import com.shareplate.backend.model.Food;
import com.shareplate.backend.repository.FoodRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"}, allowCredentials = "true")
public class FoodController {

    private final FoodRepository foodRepository;

    @Autowired
    public FoodController(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    public static class ClaimRequest {
        private String claimedBy;
        private String claimedByRole; // NGO, VOLUNTEER

        public String getClaimedBy() { return claimedBy; }
        public void setClaimedBy(String claimedBy) { this.claimedBy = claimedBy; }
        public String getClaimedByRole() { return claimedByRole; }
        public void setClaimedByRole(String claimedByRole) { this.claimedByRole = claimedByRole; }
    }

    @GetMapping
    public List<Food> getFoods(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "urgency") String sortBy
    ) {
        List<Food> list = foodRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        // Automatically mark expired items if past deadline and still marked Available
        for (Food f : list) {
            if ("Available".equalsIgnoreCase(f.getStatus()) && f.getDeadline() != null && f.getDeadline().isBefore(now)) {
                f.setStatus("Expired");
                foodRepository.save(f);
            }
        }

        // Filter by status if specified
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            list = list.stream()
                    .filter(f -> status.equalsIgnoreCase(f.getStatus()))
                    .collect(Collectors.toList());
        }

        // Filter by location
        if (location != null && !location.isBlank() && !"All locations".equalsIgnoreCase(location)) {
            list = list.stream()
                    .filter(f -> f.getLocation() != null && f.getLocation().equalsIgnoreCase(location))
                    .collect(Collectors.toList());
        }

        // Filter by search text (food name or donor)
        if (search != null && !search.isBlank()) {
            String lowerSearch = search.toLowerCase().trim();
            list = list.stream()
                    .filter(f -> (f.getName() != null && f.getName().toLowerCase().contains(lowerSearch))
                            || (f.getDonor() != null && f.getDonor().toLowerCase().contains(lowerSearch))
                            || (f.getLocation() != null && f.getLocation().toLowerCase().contains(lowerSearch)))
                    .collect(Collectors.toList());
        }

        // Expiry-aware sorting & matching
        if ("urgency".equalsIgnoreCase(sortBy)) {
            list.sort((f1, f2) -> {
                // Available items come before Claimed/Expired
                boolean f1Avail = "Available".equalsIgnoreCase(f1.getStatus());
                boolean f2Avail = "Available".equalsIgnoreCase(f2.getStatus());
                if (f1Avail && !f2Avail) return -1;
                if (!f1Avail && f2Avail) return 1;

                // Sort by earliest upcoming deadline first
                if (f1.getDeadline() != null && f2.getDeadline() != null) {
                    return f1.getDeadline().compareTo(f2.getDeadline());
                }
                return 0;
            });
        } else if ("newest".equalsIgnoreCase(sortBy)) {
            list.sort((f1, f2) -> Long.compare(f2.getId(), f1.getId()));
        }

        return list;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFoodById(@PathVariable Long id) {
        Optional<Food> foodOpt = foodRepository.findById(id);
        if (foodOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Food listing not found with id: " + id));
        }
        return ResponseEntity.ok(foodOpt.get());
    }

    @PostMapping
    public ResponseEntity<?> createFood(@Valid @RequestBody Food food) {
        if (food.getDeadline() != null && food.getDeadline().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Pickup deadline must be in the future"));
        }

        if (food.getStatus() == null || food.getStatus().isBlank()) {
            food.setStatus("Available");
        }

        Food savedFood = foodRepository.save(food);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFood);
    }

    @PatchMapping("/{id}/claim")
    public ResponseEntity<?> claimFood(
            @PathVariable Long id,
            @RequestBody(required = false) ClaimRequest claimRequest
    ) {
        Optional<Food> foodOpt = foodRepository.findById(id);
        if (foodOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Food listing not found with id: " + id));
        }

        Food food = foodOpt.get();

        if ("Claimed".equalsIgnoreCase(food.getStatus())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Food listing is already claimed"));
        }

        if (food.getDeadline() != null && food.getDeadline().isBefore(LocalDateTime.now())) {
            food.setStatus("Expired");
            foodRepository.save(food);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Food listing has expired and cannot be claimed"));
        }

        // Authorization check: verify role if provided
        String claimerRole = claimRequest != null && claimRequest.getClaimedByRole() != null
                ? claimRequest.getClaimedByRole().trim().toUpperCase()
                : null;

        if (claimerRole != null && "DONOR".equalsIgnoreCase(claimerRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Donors cannot claim food listings. Please log in as an NGO or Volunteer."));
        }

        String claimedByName = claimRequest != null && claimRequest.getClaimedBy() != null && !claimRequest.getClaimedBy().isBlank()
                ? claimRequest.getClaimedBy().trim()
                : "Authorized Recipient";

        food.setStatus("Claimed");
        food.setClaimedAt(LocalDateTime.now());
        food.setClaimedBy(claimedByName);
        food.setClaimedByRole(claimerRole != null ? claimerRole : "NGO/VOLUNTEER");

        Food updatedFood = foodRepository.save(food);
        return ResponseEntity.ok(updatedFood);
    }
}
