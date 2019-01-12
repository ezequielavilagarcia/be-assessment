# be-assessment
This is a backend assessment developed with Express to an insurance company to manage some information about insurance policies and company
clients. To do that, I should use two services that provide all the data needed http://www.mocky.io/v2/5808862710000087232b75ac 
(List of company clients) and http://www.mocky.io/v2/580891a4100000e8242b75c5 (Company policies).

# First steps
First at all run npm install, after that you can run npm start.

Once the aplication is running, to start getting data you need to login, because all the endpoints need access, you can read this
in the requirements..

# Steps to Login
First, You need to select one client email from company clients. (there are two type of clients: admin and user)
Then send it in a body of a post request to the endpoint: (You can use postman to do that).
http://localhost:3000/api/v1/auth/login

Here is an image showing how you can do it:
https://drive.google.com/file/d/1ybSOptCIFqSJv9LYA89gyDiP5Hinb2DK/view?usp=sharing.

If you want to loggin with an admin user, try with this email:
britneyblankenship@quotezart.com

If you want to loggin with a normal user try:
barnettblankenship@quotezart.com 

# Steps to get data
Once you get a token, you can get any information from the API sending it in an Authorization header in a request..

Here is an image showing how you can do it:
https://drive.google.com/file/d/1NOkD9xuMhGArVyoNBoXOPrHXEQhDmxuI/view?usp=sharing

# Integration tests

To test the app I used mocha and chai. Up to now there are 20 integration test working, you can find it in test folder.

To run tests just run npm test

# See full API documentation with Swagger

I install swagger to let you know the full information about the endpoints, models and api responses so clone the repository and open in your browser:
http://localhost:3000/api/v1/api-docs

Enjoy it!
