document.addEventListener('DOMContentLoaded', () => {
   /*=============== SHOW/HIDE PASSWORD ===============*/
   const passwordToggle = (inputId, eyeId) => {
     const input = document.getElementById(inputId);
     const icon = document.getElementById(eyeId);
     if (!input || !icon) return;
 
     icon.addEventListener('click', () => {
       input.type = input.type === 'password' ? 'text' : 'password';
       icon.classList.toggle('ri-eye-fill');
       icon.classList.toggle('ri-eye-off-fill');
     });
   };
 
   passwordToggle('password', 'loginPassword');           // Login
   passwordToggle('passwordCreate', 'loginPasswordCreate'); // Register
 
   /*=============== TOGGLE LOGIN/REGISTER VIEW ===============*/
   const loginContainer = document.getElementById('loginAccessRegister');
   const btnRegister = document.getElementById('loginButtonRegister');
   const btnAccess = document.getElementById('loginButtonAccess');
 
   if (btnRegister) btnRegister.addEventListener('click', () => loginContainer.classList.add('active'));
   if (btnAccess) btnAccess.addEventListener('click', () => loginContainer.classList.remove('active'));
 
   /*=============== REGISTER USER ===============*/
   const registerForm = document.querySelector('.login__register .login__form');
   if (registerForm) {
     registerForm.addEventListener('submit', function (e) {
       e.preventDefault();
 
       const names = document.getElementById('names')?.value;
       const address = document.getElementById('addressCreate')?.value;
       const email = document.getElementById('emailCreate')?.value;
       const password = document.getElementById('passwordCreate')?.value;
 
       if (!names || !address || !email || !password) {
         alert("Please fill in all fields.");
         return;
       }
 
       if (localStorage.getItem(email)) {
         alert('This email is already registered.');
         return;
       }
 
       const user = { names, address, email, password };
       localStorage.setItem(email, JSON.stringify(user));
 
       alert('Account created! You can now log in.');
       loginContainer.classList.remove('active'); // switch back to login
     });
   }
 
   /*=============== LOGIN USER ===============*/
   const loginForm = document.querySelector('.login__access .login__form');
   if (loginForm) {
     loginForm.addEventListener('submit', function (e) {
       e.preventDefault();
 
       const email = document.getElementById('email')?.value;
       const password = document.getElementById('password')?.value;
 
       if (!email || !password) {
         alert("Please enter your email and password.");
         return;
       }
 
       const storedUser = localStorage.getItem(email);
 
       if (!storedUser) {
         alert('User not registered.');
         return;
       }
 
       const user = JSON.parse(storedUser);
 
       if (user.password !== password) {
         alert('Incorrect password.');
         return;
       }
 
       localStorage.setItem('loggedIn', 'true');
       localStorage.setItem('username', user.names);
       localStorage.setItem('email', user.email);
       localStorage.setItem('address', user.address);
 
       alert('Login successful!');
       window.location.href = 'index.html';
     });
   }
 });
 