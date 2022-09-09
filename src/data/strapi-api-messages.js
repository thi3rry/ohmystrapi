export const messages = {
    'Invalid identifier or password': "Identifiant ou mot de passe incorrect",
    'Error: Network Error': "Erreur réseau ou serveur introuvable",
    'Network Error': "Erreur réseau ou serveur introuvable",
    'email must be a valid email': "Votre email est invalide",
    'Email is already taken': 'Adresse e-mail déjà prise par un utilisateur. Essayer de vous connecter.',
    'Your account email is not confirmed': 'Vous n\'avez pas confirmé votre email. Merci de vérifier vos e-mails (et vos spams) pour trouver le lien de confirmation de votre compte. ou',
    'Forbidden': '403 Forbidden (Interdit)',
    'Not Found': '404 Not Found (Introuvable)',
    'Please provide a valid email address': 'Merci de renseigner une adresse e-mail valide.',
};

export const getMessage = (originalApiMessage) => {
    if (messages[originalApiMessage]) {
        return messages[originalApiMessage];
    }
    return originalApiMessage;
}

export const getErrorMessageFromAxiosResponse = (response) => {
    try {
        return getMessage(response.response.data.error.message);
    } catch {
        try {
            return getMessage(response.data.error.message);
        } catch {
            try {
                return getMessage(response.error.message);
            } catch {
                try {
                    return getMessage(response.message);
                }
                catch (e) {
                    console.error('Cant found the error message from axios response', response);
                    return getMessage(response);
                }
            }
        }
    }
}
