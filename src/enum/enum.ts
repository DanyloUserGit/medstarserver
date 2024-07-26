export enum ROLES {
    ADMIN = "admin",
    USER = "user",
}
export enum ERROR_MESSAGE {
    ERROR_ACCESS_DIR = 'ERROR ACCESS DIR',
    ERROR_FILE_EXTENSION = 'BAD FILE EXTENSION, ONLY ALLOWED .jpg.png.jpeg.mp4, 30MB',
}

export enum HTTP_MESSAGE {
    FILE_DELETE = 'ALL FILES WAS DELETED SUCCESSFULY',
    EXISTING_USER = 'USER ALREDY EXITING',
}

export enum METHOD_REGISTRATION {
    FACEBOOK = 'facebook',
    GOOGLE = 'google',
    JWT = 'jwt',
}
export enum METHOD_FORGET_PASSWORD {
    PHONE = 'phone',
    EMAIL = 'email'
}
export enum GENDER {
    MALE='male',
    FEMALE='femail'
}