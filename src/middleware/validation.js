// Validation middleware for auth, users, catways, and reservations

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email || !email.includes('@')) {
        errors.push('Email valide requis');
    }

    if (!password || password.length < 6) {
        errors.push('Mot de passe requis (minimum 6 caractères)');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

const validateUser = (req, res, next) => {
    const { username, email, password } = req.body;
    const errors = [];

    if (!username || username.length < 3) {
        errors.push('Nom d\'utilisateur requis (minimum 3 caractères)');
    }

    if (!email || !email.includes('@')) {
        errors.push('Email valide requis');
    }

    if (!password || password.length < 6) {
        errors.push('Mot de passe requis (minimum 6 caractères)');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

const validateCatway = (req, res, next) => {
    const { numeroCatway, typeCatway, etatCatway } = req.body;
    const errors = [];

    if (!numeroCatway || typeof numeroCatway !== 'number') {
        errors.push('Numéro de catway valide requis');
    }

    if (!typeCatway || !['long', 'court'].includes(typeCatway)) {
        errors.push('Type de catway doit être "long" ou "court"');
    }

    if (!etatCatway || typeof etatCatway !== 'string') {
        errors.push('État du catway requis');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

const validateCatwayUpdate = (req, res, next) => {
    const { etatCatway } = req.body;
    const errors = [];

    if (!etatCatway || typeof etatCatway !== 'string') {
        errors.push('État du catway requis');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

const validateReservation = (req, res, next) => {
    const { nomClient, nomBateau, dateDebut, dateFin } = req.body;
    const errors = [];

    if (!nomClient || nomClient.length < 2) {
        errors.push('Nom du client requis');
    }

    if (!nomBateau || nomBateau.length < 2) {
        errors.push('Nom du bateau requis');
    }

    if (!dateDebut || !Date.parse(dateDebut)) {
        errors.push('Date de début valide requise');
    }

    if (!dateFin || !Date.parse(dateFin)) {
        errors.push('Date de fin valide requise');
    }

    if (dateDebut && dateFin && new Date(dateDebut) >= new Date(dateFin)) {
        errors.push('La date de fin doit être après la date de début');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

const validateReservationUpdate = (req, res, next) => {
    const { nomClient, nomBateau, dateDebut, dateFin } = req.body;
    const errors = [];

    if (nomClient && nomClient.length < 2) {
        errors.push('Nom du client invalide');
    }

    if (nomBateau && nomBateau.length < 2) {
        errors.push('Nom du bateau invalide');
    }

    if (dateDebut && !Date.parse(dateDebut)) {
        errors.push('Date de début invalide');
    }

    if (dateFin && !Date.parse(dateFin)) {
        errors.push('Date de fin invalide');
    }

    if (dateDebut && dateFin && new Date(dateDebut) >= new Date(dateFin)) {
        errors.push('La date de fin doit être après la date de début');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

module.exports = {
    validateLogin,
    validateUser,
    validateCatway,
    validateCatwayUpdate,
    validateReservation,
    validateReservationUpdate
};