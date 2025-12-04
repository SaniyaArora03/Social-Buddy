🎓 SocialBuddy — AI-Powered Learning Platform for Neurodivergent Students

A unified adaptive learning system supporting Autism, Dyslexia, and Dyscalculia.

🌟 Overview

SocialBuddy is an AI-powered educational platform designed to support children with
Autism, Dyslexia, and Dyscalculia through:

Personalized dashboards

Adaptive difficulty quizzes

Visual learning modules

Gamified activities

Real-time stress detection using webcam + AI

A unified master dashboard for navigation

Each learning module was built separately (React Vite, CRA, and Vanilla JS) and later combined into a single integrated platform using iframes and centralized routing.

🚀 Features
🧠 Three Independent Dashboards

Autism Dashboard (HTML/CSS/JS)

Emotion recognition games

Interactive routines

Communication skill activities

Live stress monitoring

Dyslexia Dashboard (React + Vite)

Reading lessons

Story-based exercises

Visual word learning

Adaptive quiz questions

Dyscalculia Dashboard (Create-React-App)

Number-based puzzles

Pattern recognition

Math skill builders

XP + Level progression

🎮 Common Games Module

All dashboards share a unified /games/ folder containing:

Memory Matching

Sorting Game

Puzzle Builder

Treasure Hunt

Story-Based Board Game

Emotion Charades
📷 AI Stress Detection

A machine-learning-enabled webcam module runs in the background to detect stress:

Captures frames every 1.5 seconds

Sends to Flask backend (/detect_stress)

Computes stress score from face features

Shows popup if stress level > threshold

Automatically adjusts difficulty if user accepts

This module is globally loaded so all dashboards benefit from stress monitoring
