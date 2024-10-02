-- パスワード初期値は `test`
INSERT INTO `user` (`id`, `created_at`, `updated_at`, `version`, `name`, `user_id`, `password`, `email`)
VALUES
    (1, NULL, NULL, 0, 'user', 1, '$2a$10$zwzBS66AQnUDXblnki/QKeF9zVvlZaSfBIL6wDKTvXv/YUPBzvkfa', 'test@noten.com');

INSERT INTO `notebook` (`id`, `created_at`, `updated_at`, `version`, `name`, `user_id`)
VALUES
    (1, NULL, NULL, 0, '1st-book', 1);

INSERT INTO `phrase` (`id`, `created_at`, `updated_at`, `version`, `abc`, `key`, `length`, `meter`, `reference`, `title`, `user_id`, `notebook_id`)
VALUES
    (1, '2016-01-11 18:00:35', '2016-01-11 18:00:35', 0, '\"Am7\" c3BA2 GF-| \"Dm7\"FG3A2c2|\"G7\"B3AG2FE-|\"C△7 C\"E8|\r\n\"F△7\" A3GF2ED-|\"Bm7(♭5)\"DE3F2A2|\"E7\"^G3FE2DC-|\"Am7\"C6 \"A7\" ^C2||\r\n\"Dm7\"DA2A-A4-|\"G7\"A4c2B2|\"C△7\"G8-|\"A7\"G6 D2|\r\n\"Dm7\"CF2F-F4-|\"G7\"A4 A2G2|\"C△7\"F3E-E4|\"Bm7(b5)\"-E4|', 'C', '1/8', '4/4', 'Bart Howard', 'Fly me to the Moon', 1, 1),
    (2, '2016-01-11 18:00:35', '2016-01-11 18:00:35', 0, 'todo', 'C', '1/8', '4/4', 'Schumann', 'トロイメライ for 4 flute ', 1, 1),
    (3, '2016-01-11 18:00:35', '2016-01-11 18:00:35', 0, 'todo', 'C', '1/16', '4/4', 'J.S.Bach', 'G線上のアリア ', 1, 1);

INSERT INTO `tag` (`id`, `created_at`, `updated_at`, `version`, `name`, `user_id`)
VALUES
    (1, NULL, NULL, 0, 'TAG1', 1),
    (2, NULL, NULL, 0, 'TAG2-1', 1),
    (3, NULL, NULL, 0, 'TAG2-2', 1),
    (4, NULL, NULL, 0, 'TAG4', 1);

INSERT INTO `tag_phrases` (`tags_id`, `phrases_id`)
VALUES
    (1, 1),
    (2, 2),
    (3, 2),
    (4, 3);
