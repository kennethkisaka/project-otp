async function signin() {
    // Get the email and password from input fields
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log(`email: ${email}`)
    console.log(`password: ${password}`)

    // Validate input (basic example)
    // if (!email || !password) {
    //     alert("Please fill in both email and password.");
    //     return;
    // }

    // Prepare the data to send to the backend
    const data = {
        email: email,
        password: password
    };

    try {
        // Send a POST request to the backend
        const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "mode": 'no-cors'
            },
            body: JSON.stringify(data)
        });

        // Handle the response
        if (response.ok) {
            console.log("ok")
            const result = await response.json();
            console.log("result", result)
            // Redirect or show success message
            console.log(response)
            window.location.href = `http://127.0.0.1:5500/otp.html?userid=${result.userid}`;
        } else {
            // Handle errors
            console.log("else")
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
        alert("An error occurred. Please try again.");
    }
}
