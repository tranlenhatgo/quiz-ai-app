package com.myproject.quizzai.controller;

import com.myproject.quizzai.dto.QuizCreationRequestDto;
import com.myproject.quizzai.dto.QuizResponseDto;
import com.myproject.quizzai.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping(QuizController.ROOT_MAPPING)
@RequiredArgsConstructor
@Tag(name = "Quiz Controller", description = "Controller for managing quizzes")
public class QuizController {
    public static final String ROOT_MAPPING = "quiz";
    private static final Logger logger = LoggerFactory.getLogger(QuizController.class);

    private final QuizService quizService;

    //POST /quiz
    @PostMapping
    @Operation(summary = "Create a new quiz")
    public ResponseEntity<Map<String, String>> create(@RequestBody QuizCreationRequestDto quizCreationRequest) {
        logger.info("create() method called with request: {}", quizCreationRequest);

        String quizId = quizService.create(quizCreationRequest);
        //create a json for response
        Map<String, String> response = new HashMap<>();
        response.put("quizId", quizId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Find quiz by User ID
    @GetMapping
    @Operation(summary = "Get quiz by user ID")
    public ResponseEntity<List<QuizResponseDto>> getQuizByUserId(@RequestParam String userId) {
        logger.info("getQuizByUserId() method called with user ID: {}", userId);

        List<QuizResponseDto> quiz = quizService.getQuizByUserId(userId);
        if (quiz != null && !quiz.isEmpty()) {
            return ResponseEntity.ok(quiz);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
