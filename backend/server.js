import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import 'dotenv/config'; // Carga las variables de .env
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import fs from 'fs';

// Inicializar Express
const app = express();

// Middleware
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear JSON en las solicitudes
app.use(session({ secret: 'tu_secreto', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Configurar la conexión a MySQL usando variables de .env
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        ca: fs.readFileSync('./certs/ca.pem'), // Ruta al certificado CA
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión a MySQL exitosa');
        connection.release();
    } catch (err) {
        console.error('Error al conectar a MySQL:', err);
    }
})();

// Configurar Passport para Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE google_id = ?', [profile.id]);
        if (users.length === 0) {
            const [result] = await pool.query(
                'INSERT INTO users (google_id, email, name) VALUES (?, ?, ?)',
                [profile.id, profile.emails[0].value, profile.displayName]
            );
            return done(null, { id: result.insertId, google_id: profile.id, email: profile.emails[0].value });
        }
        return done(null, users[0]);
    } catch (error) {
        return done(error);
    }
}));

// Serializar y deserializar usuario
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, users[0]);
});

// Ruta para iniciar la autenticación con Google
app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Ruta de callback para Google OAuth
app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('https://ecommerceespanol.onrender.com/'); // Redirige al frontend después de autenticar
    }
);

// Newsletter routes
app.post('/api/newsletter/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        const [existingSubscribers] = await pool.query(
            'SELECT * FROM newsletter_subscribers WHERE email = ?',
            [email]
        );
        if (existingSubscribers.length > 0) {
            return res.status(400).json({ message: 'Este email ya está suscrito' });
        }
        await pool.query(
            'INSERT INTO newsletter_subscribers (email) VALUES (?)',
            [email]
        );
        res.status(201).json({ message: 'Suscripción exitosa' });
    } catch (error) {
        console.error('Error al suscribir al newsletter:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});
app.get('/', (req, res) => {
    res.json({ message: '¡Servidor funcionando correctamente!' });
});
app.get('/test-db-connection', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión a MySQL desde Render exitosa');
        connection.release();
        res.json({ message: 'Conexión a MySQL exitosa' });
    } catch (error) {
        console.error('Error al conectar a MySQL desde Render:', error);
        res.status(500).json({ message: 'Error al conectar a MySQL', error: error.message });
    }
});
// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
