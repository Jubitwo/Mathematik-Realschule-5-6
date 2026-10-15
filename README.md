# Mathematik – Realschule Klasse 5–6

Interaktive Lernseite für die Realschule in Baden-Württemberg mit 14 Themenkapiteln, 48 interaktiven Erklärungsstationen (einschließlich der Datenerkundung unter „Entdecken“) und 211 Aufgaben (206 reguläre und 5 zuschaltbare Zusatzaufgaben).

## Lernen und üben

- Themenkarten statt einer langen Textseite: ein Kapitel auf einmal
- Drei klar getrennte Lernschritte: Entdecken, Verstehen und Üben
- Kurze Einstiege; ausführliche Erklärungen und zusätzliche Papieraufgaben bei Bedarf aufklappen
- Konkrete Entdeckeraufträge mit einstellbaren Startwerten: erst vermuten, einen Wert ändern, dann die Veränderung begründen
- „Vorher merken“ speichert das Entdeckerbild und seine Werte zum direkten Vorher-Nachher-Vergleich; „Zahlen zurücksetzen“ stellt den Anfang wieder her
- Beschriftete interaktive Modelle: Zahlenstrahlen, Bruchkreis, Zehntelbalken, Winkel, Waage, Flächenkästchen und Würfelhäufigkeiten
- Bildwechsel per Schieberegler: beispielsweise Bruchstreifen, Kuchenstücke und Zahlenstrahl für denselben Anteil
- Zweiter Schieberegler für Hilfen in kleinen Schritten; alternativ über große Schaltflächen und Tastatur bedienbar
- Bilderhilfe bei jeder Aufgabe; passende mathematische Modelle oder Denkpläne mit Schrittkarten, ohne automatisch die Musterlösung einzublenden
- Große Kuchendarstellungen und platzsparendes Layout für Smartphones und Tablets
- Einheiten ohne vorausgesetzte Umrechnungsregeln entdecken: Meterband einteilen, einen Boden Reihe für Reihe fliesen und eine Kiste Schicht für Schicht mit Würfeln füllen. Vier Bildschritte führen vom einzelnen großen Stück zum Zählen kleiner Stücke; weitere Meterstücke, Bodenquadrate und Kisten kommen erst im letzten Schritt hinzu.
- Korrigierte Winkelzeichnung für 0–180°, vollständiger Zahlenstrahl von −16 bis 16 und gemeinsam bewegte Waagschalen
- Lernziel-Check mit immer sichtbarer Rechnung, zählbaren Plättchen, drei Zahlenreglern und eigener Antwortprüfung; Klammern werden als andere Gruppierung erklärt
- Feste Skala bei Zahlenmustern, gleiche Längeneinheiten bei Rechteckbildern, Würfelschichten und Körpernetze sowie Zeitwege über die volle Stunde
- Aufgaben einzeln bearbeiten; Leicht, Mittel und Knifflig gezielt auswählen
- Antworten eintippen: richtige Lösungen werden grün und mit Rechenweg erklärt
- Bei falschen Antworten helfen drei Rechentipps
- Beim Kürzen ist ein vollständig gekürzter Bruch erforderlich
- Wird ausdrücklich ein Bruch verlangt, muss die Antwort als Bruch eingegeben werden
- Gleichwertige Zahlen- und Bruchantworten, gemischte Zahlen sowie passende Zwischenwerte werden berücksichtigt
- Themenlinks und Browser-Zurück funktionieren; Druckansicht zeigt alle Kapitel und Erklärungen

## Bildungsplan und Zielgruppe

Die Inhalte sind anhand der offiziellen M-Niveau-Kompetenztabellen Klasse 5/6 des Bildungsplans Mathematik Baden-Württemberg, Fassung vom 29.02.2024 (V2), überarbeitet. Ergänzt wurden unter anderem Primfaktoren, periodische Dezimalzahlen, Dreisatz, Maßstab, Spiegelungen, Körpernetze, Oberfläche und Datenauswertung. Die Quellen sind auf der Lernseite verlinkt.

Die visuelle Gestaltung unterstützt Schülerinnen und Schüler bis Klasse 7. Der Lernstoff bleibt Klasse 5/6; dies ist kein vollständiger Kurs für Klasse 7. Elf Papier- und Praxisaufträge ergänzen das Zeichnen, Messen, Begründen und Erheben von Daten. Die automatische Antwortprüfung ersetzt keine Beurteilung dieser praktischen Kompetenzen.

Die Verständlichkeit wurde sprachlich und anhand der Bedienabläufe überarbeitet. Eine Erprobung mit echten Lerngruppen steht noch aus; individuelle Schülerverständlichkeit lässt sich nicht allein durch technische Tests nachweisen.

## Öffnen

[Online lernen](https://jubitwo.github.io/Mathematik-Realschule-5-6/)

Für die lokale Nutzung [index.html](./index.html) herunterladen und in einem aktuellen Browser öffnen. Es ist keine Installation notwendig.

## Prüfen

Die Regressionstests benötigen nur Node.js, keine zusätzlichen Pakete:

```sh
node --test learning.test.cjs
```

Sie prüfen unter anderem alle 211 hinterlegten Lösungen, die drei Tipps pro Aufgabe, Bruchformate, offene Intervalle, die Plättchenanzahl bei Punkt-vor-Strich-Aufgaben sowie Start- und Randzustände sämtlicher Reglerstationen. Die visuelle Darstellung und die Bedienung werden zusätzlich im Browser geprüft.
