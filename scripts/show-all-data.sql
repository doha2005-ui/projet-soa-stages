USE soa_stages;

SELECT '--- TABLE ENTREPRISES ---' as '';
SELECT id, raison_sociale, secteur, ville, contact_email, conventionnee FROM entreprises;

SELECT '--- TABLE STAGES ---' as '';
SELECT id, intitule, etat, tuteur_entreprise, tuteur_academique FROM stages;

SELECT '--- TABLE EVALUATIONS ---' as '';
SELECT id, stage_id, note_entreprise, note_academique, commentaire_tuteur FROM evaluations;

