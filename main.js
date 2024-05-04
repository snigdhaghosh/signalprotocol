// script.js
document.addEventListener('DOMContentLoaded', function () {
    // Function to switch between pages
    function switchPage(pageId) {
        var pages = document.querySelectorAll('.page');
        pages.forEach(function (page) {
            page.classList.add('hidden');
        });
        document.getElementById(pageId).classList.remove('hidden');
    }

    // Login Form Submission
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();
        // Add logic to handle login
        switchPage('messagePage'); // Switch to message page after login
    });

    // Open Single Chat Page
    document.getElementById('contactList').addEventListener('click', function (event) {
        if (event.target.classList.contains('contact')) {
            var username = event.target.dataset.username;
            document.getElementById('chatUsername').innerText = username; // Set username in chat header
            switchPage('singleChatPage'); // Switch to single chat page
        }
    });

    // Send Message Button Click
    document.getElementById('sendMessageBtn').addEventListener('click', function () {
        var message = document.getElementById('messageText').value;
        // Add logic to send message
        document.getElementById('messageText').value = ''; // Clear message input after sending
    });
});
