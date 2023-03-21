# Aké queries nám treba

- získanie všetkých uzlov `MATCH (n) RETURN n`
- získanie všetkých uzlov ktorých koncovka alebo veľkosť je /nejaký fulltext/ `MATCH (n) WHERE n.extension = ".pdf" RETURN n`
- obmedzenie počtu uzlov - napríklad iba uzly ktoré sú po tretiu úroveň
- zoznam keywordov a tie poprepájané - napríklad prepojený pes a mačka, lebo článok má v názve psa aj mačku
- zoznam keywordov a bez prepojenia medzi sebou