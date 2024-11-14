// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
        });
    });
});

function toggleMenu() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    
    // Toggle 'active' class for smooth open/close animation
    navbar.classList.toggle('active');
    hamburger.classList.toggle('active');
    
}

// Sticky header that hides on scroll down and shows on scroll up
let lastScrollY = window.scrollY;

window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
        // Scrolling down, hide the header
        header.style.top = '-80px';  // Adjust this value based on your header height
    } else {
        // Scrolling up, show the header
        header.style.top = '0';
    }

    lastScrollY = currentScrollY;
});


// Initialize a flag to track form submission
let isFormSubmitted = false;

// Load previously submitted emails from local storage
const submittedEmails = JSON.parse(localStorage.getItem('submittedEmails')) || [];

document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get email from form input
    const email = this.user_email.value;

    // Check for duplicates
    if (submittedEmails.includes(email)) {
        alert('This email has already been registered.'); // Alert if email is a duplicate
        return; // Exit the function to prevent further processing
    }

    // Send email through EmailJS
    emailjs.sendForm('service_mdd9oul', 'template_0qkqdlw', this)
        .then(function (response) {
            console.log('SUCCESS!', response.status, response.text);

            // Set flag to true since form submission is successful
            isFormSubmitted = true;

            // Store the client info in local storage
            submittedEmails.push(email); // Store the email in the array
            localStorage.setItem('submittedEmails', JSON.stringify(submittedEmails)); // Update local storage for emails

            alert('Your message has been sent successfully!'); // Alert on success
            document.getElementById('contact-form').reset(); // Reset the form after successful submission
        }, function (error) {
            console.log('FAILED...', error);
            alert('Failed to send your message. Please try again later.');
        });
});

function requestService(button) {
    // Prompt user to enter their email
    const emailInput = prompt("Please enter your email:");

    if (emailInput === null || emailInput === "") {
        alert("Email is required to proceed with the request.");
        return; // Exit if the email input is empty
    }

    // Check if the email exists in localStorage
    const submittedEmails = JSON.parse(localStorage.getItem('submittedEmails')) || [];
    if (submittedEmails.includes(emailInput)) {
        // If the email exists, prepare the WhatsApp link
        const packageType = button.getAttribute("data-package");
        const whatsappLink = `whatsapp://send?phone=27676080195&text=Hello!%20I'm%20interested%20in%20the%20${encodeURIComponent(packageType)}.%20Can%20you%20provide%20more%20information?`;

        // Attempt to open WhatsApp application
        window.location.href = whatsappLink;
    } else {
        // If the email is not registered, direct the user to the contact form
        alert("This email is not registered. Please complete the contact form first.");
        window.location.href = "#contact-form-section"; // Scroll to the contact form section
    }
}


// Get the button
const backToTopBtn = document.getElementById('backToTopBtn');

// Show button when user scrolls down 100px from the top
window.onscroll = function() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
};

// Scroll to top when button is clicked
backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Request btn
let promptShown = false; // Variable to track if the prompt has been shown

document.querySelectorAll('.request-service-btn').forEach(button => {
    button.addEventListener('click', function() {
        if (!promptShown) {
            document.getElementById('prompt-overlay').style.display = 'flex'; // Show the prompt overlay
        } else {
            // Scroll to the contact section directly if prompt was already shown
            const contactSection = document.getElementById('contact');
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Handle confirmation button click
document.getElementById('confirm-btn').addEventListener('click', function() {
    promptShown = true; // Set the flag to true
    const contactSection = document.getElementById('contact');
    contactSection.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('prompt-overlay').style.display = 'none'; // Hide the prompt overlay
});

// Handle cancel button click
document.getElementById('cancel-btn').addEventListener('click', function() {
    promptShown = true; // Set the flag to true, so the prompt won't show again
    document.getElementById('prompt-overlay').style.display = 'none'; // Hide the prompt overlay
});

window.addEventListener('scroll', function() {
    const homeSection = document.querySelector('.home');
    let scrollPosition = window.pageYOffset;
    homeSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
  });
  

// Chat bot functionalilyt
const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT || 5500;

app.use(express.json());

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [
          { 
            text: "You are Sam, an assistant for Site Mastery. Site Mastery specializes in high-quality web and mobile application development, with a focus on UX/UI design, responsive websites, and app development for Android and iOS. Services also include consultation and online lessons. Available packages are Basic (5 pages, advanced SEO, 1 revision), Standard (10 pages, advanced SEO, 2 revisions), and E-commerce (15 pages, basic SEO, 3 revisions). Please greet the user and offer to help with any Site Mastery services."
          }
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: `Hello! Welcome to Site Mastery! 
            We specialize in creating high-quality web and mobile applications. 
            With a deep passion for coding, we aim to deliver exceptional user experiences through:
            - Full-stack Website Development, including both frontend and backend.
            - Custom Mobile App Development for both Android and iOS.
            - Personalized Consultations for your web solutions.
            - Engaging Online Web Development Lessons.
            - End-to-end E-commerce Solutions with secure payment integrations.
            - Hosting and Maintenance to keep your website secure and optimized.

            How can I assist you with Site Mastery today? Feel free to ask about our services or any package details!
            `
          }
        ],
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});

app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});



