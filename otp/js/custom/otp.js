async function verifyOtp() {
    // Get the email and password from input fields
    const otp = document.getElementById("otp").value;

    const currentUrl = window.location.href;
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userid");
    console.log(userId); // Extracts userid from the current page's URL




    console.log(`otp: ${otp}`)

    // Validate input (basic example)
    // if (!email || !password) {
    //     alert("Please fill in both email and password.");
    //     return;
    // }

    // Prepare the data to send to the backend
    const data = {
        otp: otp,
        userid: userId
    };

    try {
        // Send a POST request to the backend
        const response = await fetch("http://127.0.0.1:5000/api/auth/verify-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "mode": 'no-cors'
            },
            body: JSON.stringify(data)
        });

        // Handle the response
        if (response.ok) {
            const result = await response.json();
            console.log(result)
            // Redirect or show success message
            window.location.href = "./documentation.html";
        } else {
            // Handle errors
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error("Error during sending otp:", error);
        alert("An error occurred. Please try again.");
    }
}
