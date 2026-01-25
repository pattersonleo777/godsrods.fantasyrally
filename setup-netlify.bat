@echo off
echo 🚀 GodsRods Netlify Setup Script
echo ================================

REM Create netlify functions directory
echo 📁 Creating Netlify functions directory...
if not exist "netlify\functions" mkdir netlify\functions

REM Create auth-register function
echo 📝 Creating auth-register function...
(
echo const { createClient } = require('^@supabase/supabase-js'^);
echo const bcrypt = require('bcryptjs'^);
echo const jwt = require('jsonwebtoken'^);
echo.
echo const supabase = createClient^(
echo   process.env.SUPABASE_URL,
echo   process.env.SUPABASE_KEY
echo ^);
echo.
echo exports.handler = async (event, context^) =^> {
echo   try {
echo     const { username, email, password, team } = JSON.parse(event.body^);
echo.
echo     // Check if user exists
echo     const { data: existingUser } = await supabase
echo       .from('profiles'^)
echo       .select('*'^)
echo       .eq('email', email^)
echo       .single^(^);
echo.
echo     if (existingUser^) {
echo       return {
echo         statusCode: 400,
echo         body: JSON.stringify({ message: 'User exists' }^)
echo       };
echo     }
echo.
echo     const hashedPassword = await bcrypt.hash(password, 10^);
echo.
echo     const { data: newUser, error } = await supabase
echo       .from('profiles'^)
echo       .insert([{
echo         username,
echo         email,
echo         password: hashedPassword,
echo         team: team ^|^| 'Independent',
echo         balance: 10000,
echo         garage: []
echo       }]^)
echo       .select^(^)
echo       .single^(^);
echo.
echo     if (error^) throw error;
echo.
echo     const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '24h' }^);
echo.
echo     return {
echo       statusCode: 201,
echo       body: JSON.stringify({ 
echo         token, 
echo         user: { username, email, balance: 10000, team: newUser.team, garage: [] } 
echo       }^)
echo     };
echo   } catch (e^) {
echo     return {
echo       statusCode: 500,
echo       body: JSON.stringify({ message: 'Server Error' }^)
echo     };
echo   }
echo };
) > netlify\functions\auth-register.js

REM Create auth-login function
echo 📝 Creating auth-login function...
(
echo const { createClient } = require('^@supabase/supabase-js'^);
echo const bcrypt = require('bcryptjs'^);
echo const jwt = require('jsonwebtoken'^);
echo.
echo const supabase = createClient^(
echo   process.env.SUPABASE_URL,
echo   process.env.SUPABASE_KEY
echo ^);
echo.
echo exports.handler = async (event, context^) =^> {
echo   try {
echo     const { email, password } = JSON.parse(event.body^);
echo.
echo     const { data: user, error } = await supabase
echo       .from('profiles'^)
echo       .select('*'^)
echo       .eq('email', email^)
echo       .single^(^);
echo.
echo     if (!user ^|^| error ^|^| !^(!await bcrypt.compare(password, user.password^)^)^) {
echo       return {
echo         statusCode: 401,
echo         body: JSON.stringify({ message: 'Invalid credentials' }^)
echo       };
echo     }
echo.
echo     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' }^);
echo.
echo     return {
echo       statusCode: 200,
echo       body: JSON.stringify({ 
echo         token, 
echo         user: { 
echo           username: user.username, 
echo           email: user.email, 
echo           balance: user.balance, 
echo           team: user.team, 
echo           garage: user.garage 
echo         } 
echo       }^)
echo     };
echo   } catch (e^) {
echo     return {
echo       statusCode: 500,
echo       body: JSON.stringify({ message: 'Server Error' }^)
echo     };
echo   }
echo };
) > netlify\functions\auth-login.js

REM Create shop-buy function
echo 📝 Creating shop-buy function...
(
echo const { createClient } = require('^@supabase/supabase-js'^);
echo.
echo const supabase = createClient^(
echo   process.env.SUPABASE_URL,
echo   process.env.SUPABASE_KEY
echo ^);
echo.
echo exports.handler = async (event, context^) =^> {
echo   try {
echo     const { email, item } = JSON.parse(event.body^);
echo.
echo     const { data: user } = await supabase
echo       .from('profiles'^)
echo       .select('*'^)
echo       .eq('email', email^)
echo       .single^(^);
echo.
echo     if (!user^) {
echo       return {
echo         statusCode: 404,
echo         body: JSON.stringify({ message: 'User not found' }^)
echo       };
echo     }
echo.
echo     if (user.balance ^< item.price^) {
echo       return {
echo         statusCode: 400,
echo         body: JSON.stringify({ message: 'Insufficient funds' }^)
echo       };
echo     }
echo.
echo     const newBalance = user.balance - item.price;
echo     const newGarage = [...user.garage, { ...item, purchaseDate: new Date^(^), condition: 100 }];
echo.
echo     const { error } = await supabase
echo       .from('profiles'^)
echo       .update({ balance: newBalance, garage: newGarage }^)
echo       .eq('email', email^);
echo.
echo     if (error^) {
echo       return {
echo         statusCode: 500,
echo         body: JSON.stringify({ message: 'Update failed' }^)
echo       };
echo     }
echo.
echo     return {
echo       statusCode: 200,
echo       body: JSON.stringify({ balance: newBalance, garage: newGarage }^)
echo     };
echo   } catch (e^) {
echo     return {
echo       statusCode: 500,
echo       body: JSON.stringify({ message: 'Server Error' }^)
echo     };
echo   }
echo };
) > netlify\functions\shop-buy.js

REM Create asset directories
echo 📁 Creating asset directories...
if not exist "assets\images" mkdir assets\images
if not exist "assets\models" mkdir assets\models
if not exist "assets\sounds" mkdir assets\sounds

echo.
echo 🎉 Netlify setup complete!
echo.
echo 📋 Next steps:
echo 1. Commit and push changes to GitHub
echo 2. Deploy to Netlify
echo 3. Set environment variables in Netlify dashboard
echo 4. Test the deployment
echo.
echo 📁 Created files:
echo    - netlify\functions\auth-register.js
echo    - netlify\functions\auth-login.js
echo    - netlify\functions\shop-buy.js
echo    - assets\images\
echo    - assets\models\
echo    - assets\sounds\
echo.
echo 🔧 Don't forget to:
echo    - Run the SQL setup in Supabase
echo    - Set environment variables in Netlify
echo    - Install and run the admin GUI
echo.
pause
