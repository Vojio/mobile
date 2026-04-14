export const CASE_LIBRARY = [
  {
    id: "caries-17",
    domain: "Karies",
    title: "Approximalkaries an Zahn 17",
    patient: "Lukas M., 22 Jahre",
    difficulty: "Leicht",
    duration: "6-8 Min.",
    model: "Modell A1",
    summary:
      "Fruehe approximal sichtbare Laesion mit Kaltreiz und der Frage, ob non-invasives Vorgehen noch ausreicht.",
    resources: [
      "3D-Modell A1: Oberkiefer rechts",
      "Video: Approximalbefund lesen",
      "Cheat Sheet: ICDAS kurz erklaert"
    ],
    learningGoals: [
      "Kariesaktivitaet einschaetzen",
      "Invasive und non-invasive Therapie abgrenzen"
    ],
    steps: [
      {
        phase: "Anamnese",
        title: "Beschwerdebild erfassen",
        prompt:
          "Beim Essen suesser Speisen tritt kurzzeitiger Schmerz im rechten Oberkiefer auf. Der Reiz klingt rasch ab.",
        findings: [
          "Keine Spontanschmerzen",
          "Kurzer Kaeltereiz",
          "Keine Klopfempfindlichkeit"
        ],
        cheatSheet: [
          "Kurzer Reiz mit schnellem Abklingen spricht eher gegen eine fortgeschrittene pulpitische Beteiligung."
        ],
        question: {
          text: "Welche Einordnung ist am ehesten passend?",
          options: [
            {
              label: "Fortgeschrittener endodontischer Notfall",
              correct: false,
              rationale:
                "Dafuer fehlen Spontanschmerz, Nachschmerz und apikale Hinweise.",
              points: 0
            },
            {
              label: "Aktive karioese Laesion mit weiterer Befundpflicht",
              correct: true,
              rationale:
                "Die Symptomatik passt zu einer karioesen Laesion, die klinisch genauer beurteilt werden muss.",
              points: 90
            },
            {
              label: "Reines parodontales Geschehen",
              correct: false,
              rationale:
                "Es gibt hier keinen primaeren Hinweis auf ein marginales Problem.",
              points: 0
            }
          ]
        }
      },
      {
        phase: "Befund",
        title: "Befund vertiefen",
        prompt:
          "Die approximal sichtbare Schmelzveraenderung wirkt matt, plaque-nah und leicht retentiv. Eine deutliche Kavitation ist klinisch nicht sicher tastbar.",
        findings: [
          "Radiologisch Laesion bis ins aeussere Dentin",
          "Kontaktpunkt schwer einsehbar",
          "Mundhygiene mittelmaessig"
        ],
        cheatSheet: [
          "Aktivitaet und Reinigungsfaehigkeit sind fuer die Therapieentscheidung zentral.",
          "Nicht jede radiologisch dentinreiche Laesion bedeutet sofort restaurativ."
        ],
        question: {
          text: "Welcher Schritt ist jetzt am sinnvollsten?",
          options: [
            {
              label: "Aktivitaet dokumentieren und individuelle Praevention plus Verlaufskontrolle planen",
              correct: true,
              rationale:
                "Bei fehlender sicherer Kavitation kann ein kontrolliertes non-invasives Vorgehen gerechtfertigt sein.",
              points: 120
            },
            {
              label: "Sofortige Extraktion",
              correct: false,
              rationale:
                "Das waere bei diesem Befund voellig unverhaeltnismaessig.",
              points: 0
            },
            {
              label: "Antibiotikagabe ohne weitere Massnahmen",
              correct: false,
              rationale:
                "Dafuer besteht weder Indikation noch Nutzen.",
              points: 0
            }
          ]
        }
      },
      {
        phase: "Therapie",
        title: "Behandlung festlegen",
        prompt:
          "Nach Trockenlegung wird keine offene Kavitation sichtbar. Die Patientin ist motiviert und fuer Recall erreichbar.",
        findings: [
          "Reinigungsfaehigkeit verbesserbar",
          "Recall wahrscheinlich",
          "Laesion ohne klare Oberflaechenzerstoerung"
        ],
        cheatSheet: [
          "Nicht-invasive Therapie verlangt Kontrolle und Mitarbeit.",
          "Die App soll spaeter idealerweise auch Recall-Entscheidungen trainieren."
        ],
        question: {
          text: "Welche Primaerstrategie passt jetzt am besten?",
          options: [
            {
              label: "Praeventives Management mit Fluoridierung, Hygieneinstruktion und Recall",
              correct: true,
              rationale:
                "Das ist bei nicht sicher kavitierter Laesion und guter Mitwirkung plausibel.",
              points: 110
            },
            {
              label: "Wurzelkanalbehandlung",
              correct: false,
              rationale:
                "Dafuer gibt es keine Hinweise.",
              points: 0
            },
            {
              label: "Nur Analgetika bei Bedarf",
              correct: false,
              rationale:
                "Damit fehlt die eigentliche Kariesstrategie.",
              points: 0
            }
          ]
        }
      }
    ]
  },
  {
    id: "pulpitis-36",
    domain: "Endodontie",
    title: "Akute Zahnschmerzen an Zahn 36",
    patient: "Nina B., 26 Jahre",
    difficulty: "Mittel",
    duration: "8-10 Min.",
    model: "Modell B2",
    summary:
      "Tiefe okklusale Karies mit anhaltendem Kaelteschmerz und Verdacht auf irreversible Pulpitis.",
    resources: [
      "3D-Modell B2: Molar links unten",
      "Video: Vitalitaetstest richtig durchfuehren",
      "Cheat Sheet: Pulpitis vs. apikale Pathologie"
    ],
    learningGoals: [
      "Pulpitische Symptomatik sauber deuten",
      "Endodontische Indikation begruenden"
    ],
    steps: [
      {
        phase: "Untersuchung",
        title: "Leitsymptome einordnen",
        prompt:
          "Die Patientin berichtet ueber seit zwei Tagen zunehmende Schmerzen. Kaeltereize loesen den Schmerz aus, der noch einige Zeit nachhaelt.",
        findings: [
          "Tiefe okklusale Karies an Zahn 36",
          "Keine deutliche Schwellung",
          "Keine systemischen Zeichen"
        ],
        cheatSheet: [
          "Anhaltender Nachschmerz macht eine irreversible Pulpitis wahrscheinlicher.",
          "Symptomatik nicht mit apikaler Abszedierung verwechseln."
        ],
        question: {
          text: "Welche Verdachtsdiagnose ist am plausibelsten?",
          options: [
            {
              label: "Irreversible Pulpitis an Zahn 36",
              correct: true,
              rationale:
                "Die Kombination aus tiefer Karies und Nachschmerz spricht deutlich dafuer.",
              points: 120
            },
            {
              label: "Marginale Gingivitis ohne Zahnhartsubstanzproblem",
              correct: false,
              rationale:
                "Das erklaert die Befunde nicht.",
              points: 0
            },
            {
              label: "Akuter apikaler Abszess",
              correct: false,
              rationale:
                "Schwellung und deutliche apikale Symptomatik fehlen.",
              points: 0
            }
          ]
        }
      },
      {
        phase: "Diagnostik",
        title: "Arbeitsdiagnose absichern",
        prompt:
          "Vor Therapiebeginn muss die pulpitische Problematik gegen apikale oder parodontale Ursachen abgegrenzt werden.",
        findings: [
          "Bissschmerz nur gering",
          "Patientin kann Zahn 36 zuordnen",
          "Keine extraorale Auffaelligkeit"
        ],
        cheatSheet: [
          "Vitalitaetsprobe, Perkussion und Roentgenbild ergeben zusammen den belastbaren Befund.",
          "Nicht allein aus Schmerzintensitaet invasiv handeln."
        ],
        question: {
          text: "Welche Massnahme ist jetzt am sinnvollsten?",
          options: [
            {
              label: "Vitalitaetstest, Perkussion und periapikales Roentgenbild",
              correct: true,
              rationale:
                "Das ist der saubere naechste Schritt vor der Therapieentscheidung.",
              points: 140
            },
            {
              label: "Sofortige Extraktion ohne Diagnostik",
              correct: false,
              rationale:
                "Dafuer ist der Befund nicht belastbar genug.",
              points: 0
            },
            {
              label: "Wiedervorstellung in sechs Monaten",
              correct: false,
              rationale:
                "Die Symptomatik ist akut und erfordert zeitnahe Klaerung.",
              points: 0
            }
          ]
        }
      },
      {
        phase: "Behandlung",
        title: "Therapie priorisieren",
        prompt:
          "Der Zahn reagiert stark und anhaltend auf Kaelte. Im Roentgenbild zeigt sich eine tiefe Karies, aber keine klare apikale Aufhellung.",
        findings: [
          "Vitalitaet positiv mit deutlichem Nachschmerz",
          "Perkussion nur leicht sensibel",
          "Zahn wirkt restituierbar"
        ],
        cheatSheet: [
          "Bei irreversibler Pulpitis ist Zahnerhalt primaer zu pruefen.",
          "Schmerzfreiheit ohne Ursachenbehandlung reicht nicht aus."
        ],
        question: {
          text: "Welche Behandlung ist primaer angezeigt?",
          options: [
            {
              label: "Endodontische Behandlung zur Zahnerhaltung",
              correct: true,
              rationale:
                "Die Befunde sprechen fuer eine irreversible Pulpitis bei restituierbarem Zahn.",
              points: 170
            },
            {
              label: "Nur Analgetika und Kontrolle naechste Woche",
              correct: false,
              rationale:
                "Das verschiebt die notwendige Behandlung.",
              points: 0
            },
            {
              label: "Sofortige Schienung",
              correct: false,
              rationale:
                "Es gibt keinen Hinweis auf ein primaeres Trauma- oder Okklusionsproblem.",
              points: 0
            }
          ]
        }
      },
      {
        phase: "Reflexion",
        title: "Transfer sichern",
        prompt:
          "Der Fall ist abgeschlossen. Jetzt folgt der kurze Praxistransfer, damit aus der richtigen Antwort klinische Handlungssicherheit wird.",
        findings: [
          "Fallstruktur trennt Befund, Diagnose und Therapie",
          "Quizpunkte gehen ins Ranking ein",
          "Cheat Sheets bleiben verfuegbar"
        ],
        cheatSheet: [
          "Digitale Fallfuehrung ersetzt nicht die Modellarbeit, sondern strukturiert sie.",
          "Fachliche Validierung erfolgt im Hackathon mit den Fallgebern."
        ],
        question: {
          text: "Was ist der groesste Lerneffekt dieses Formats?",
          options: [
            {
              label: "Digitale Fallfuehrung und physische Uebung werden gekoppelt",
              correct: true,
              rationale:
                "Genau diese Verbindung ist der Kern des Serious-Gaming-Ansatzes.",
              points: 110
            },
            {
              label: "Die App ersetzt jede praktische Uebung vollstaendig",
              correct: false,
              rationale:
                "Sie soll die praktische Uebung anleiten und ergaenzen.",
              points: 0
            },
            {
              label: "Es zaehlt nur Geschwindigkeit",
              correct: false,
              rationale:
                "Diagnosequalitaet bleibt zentral.",
              points: 0
            }
          ]
        }
      }
    ]
  },
  {
    id: "paro-11-26",
    domain: "Parodontologie",
    title: "Parodontaler Befund im Frontzahnbereich",
    patient: "Selin K., 41 Jahre",
    difficulty: "Mittel",
    duration: "7-9 Min.",
    model: "Modell C4",
    summary:
      "Blutung, Taschentiefen und Plaqueindex muessen in einen schluessigen parodontologischen Therapieplan ueberfuehrt werden.",
    resources: [
      "3D-Modell C4: Frontzahnbereich",
      "Video: Sondieren ohne Messfehler",
      "Cheat Sheet: Staging und Grading kompakt"
    ],
    learningGoals: [
      "Parodontalen Status interpretieren",
      "Initialtherapie sauber priorisieren"
    ],
    steps: [
      {
        phase: "Status",
        title: "Parodontalen Erstbefund lesen",
        prompt:
          "Die Patientin berichtet ueber Zahnfleischbluten beim Putzen. Klinisch zeigen sich Plaque und generalisierte Entzuendungszeichen.",
        findings: [
          "Sondierungstiefen mehrfach 5-6 mm",
          "Blutung auf Sondieren",
          "Lockerungsgrad unauffaellig"
        ],
        cheatSheet: [
          "Entscheidend ist die systematische Statusaufnahme, nicht der Einzeleindruck.",
          "Blutung auf Sondieren ist ein wichtiger Aktivitaetsmarker."
        ],
        question: {
          text: "Welcher Eindruck ist am plausibelsten?",
          options: [
            {
              label: "Reine reversible Gingivitis ohne Attachmentverlust",
              correct: false,
              rationale:
                "Die gemessenen Taschentiefen sprechen gegen eine reine Gingivitis.",
              points: 0
            },
            {
              label: "Behandlungsbeduerftiger parodontaler Befund mit weiterem Staging-Bedarf",
              correct: true,
              rationale:
                "Die Sondierungstiefen und Blutung machen eine weitergehende parodontologische Einordnung noetig.",
              points: 110
            },
            {
              label: "Endodontischer Einzelfall",
              correct: false,
              rationale:
                "Die Befunde sind primaer parodontal gepraegt.",
              points: 0
            }
          ]
        }
      },
      {
        phase: "Diagnostik",
        title: "Initiale Planung",
        prompt:
          "Vor einer definitiven Therapieplanung sollen Ausdehnung, Risikofaktoren und Motivation strukturiert erfasst werden.",
        findings: [
          "Raucheranamnese positiv",
          "Plaquekontrolle verbesserungsfaehig",
          "Kein akuter Schmerz"
        ],
        cheatSheet: [
          "Risikofaktoren, Hygiene und Motivation gehoeren in den parodontologischen Erstplan.",
          "Staging und Grading brauchen systematische Daten."
        ],
        question: {
          text: "Was gehoert jetzt in den naechsten Schritt?",
          options: [
            {
              label: "Initialtherapie mit Mundhygieneinstruktion, supragingivaler Reinigung und kompletter Statusdokumentation",
              correct: true,
              rationale:
                "Das schafft die Basis fuer jede belastbare parodontologische Weiterbehandlung.",
              points: 130
            },
            {
              label: "Direkte Kronenversorgung aller betroffenen Zaehne",
              correct: false,
              rationale:
                "Das loest das primaere parodontale Problem nicht.",
              points: 0
            },
            {
              label: "Ausschliesslich Antibiotika",
              correct: false,
              rationale:
                "Ohne mechanische Therapie und Hygieneplan ist das kein primaerer Ansatz.",
              points: 0
            }
          ]
        }
      },
      {
        phase: "Therapie",
        title: "Naechste Stufe definieren",
        prompt:
          "Nach Aufklaerung und initialer Motivation soll die subgingivale Therapie geplant werden.",
        findings: [
          "Patientin kooperativ",
          "Plaqueindex ruecklaeufig",
          "Entzuendung weiterhin vorhanden"
        ],
        cheatSheet: [
          "Parodontaltherapie ist stufenweise und reevaluationspflichtig.",
          "Das Spielkonzept kann hier mit Badges fuer saubere Re-Evaluation arbeiten."
        ],
        question: {
          text: "Welcher Ansatz passt jetzt am besten?",
          options: [
            {
              label: "Subgingivale Instrumentierung mit anschliessender Reevaluation",
              correct: true,
              rationale:
                "Das entspricht dem strukturierten Stufenkonzept nach der Initialtherapie.",
              points: 150
            },
            {
              label: "Kein weiterer Schritt, solange keine Schmerzen bestehen",
              correct: false,
              rationale:
                "Parodontale Aktivitaet ist nicht an Schmerz gebunden.",
              points: 0
            },
            {
              label: "Nur Bleaching zur aesthetischen Verbesserung",
              correct: false,
              rationale:
                "Das verfehlt das Behandlungsziel komplett.",
              points: 0
            }
          ]
        }
      }
    ]
  },
  {
    id: "endo-11",
    domain: "Endodontie",
    title: "Traumatischer Frontzahn mit Sensibilitaetsverlust",
    patient: "Hannah S., 19 Jahre",
    difficulty: "Mittel",
    duration: "8-9 Min.",
    model: "Modell D3",
    summary:
      "Nach Frontzahntrauma muessen Vitalitaet, Fraktur und endodontische Konsequenz sauber differenziert werden.",
    resources: [
      "3D-Modell D3: Trauma-Front",
      "Video: Frakturlinien absichern",
      "Cheat Sheet: Trauma-Basisdiagnostik"
    ],
    learningGoals: [
      "Traumafall strukturiert abarbeiten",
      "Endodontischen Handlungsbedarf abschaetzen"
    ],
    steps: [
      {
        phase: "Traumaaufnahme",
        title: "Akutbefund strukturieren",
        prompt:
          "Eine Woche nach Fahrradsturz berichtet die Patientin ueber Druckgefuehl an Zahn 11. Die Sensibilitaetsprobe bleibt aktuell negativ.",
        findings: [
          "Leichte Verfaerbung an Zahn 11",
          "Keine ausgepraegte Lockerung",
          "Lippenverletzung abgeheilt"
        ],
        cheatSheet: [
          "Nach Trauma kann die Sensibilitaet voruebergehend aussetzen.",
          "Eine Momentaufnahme reicht nicht immer fuer die Endentscheidung."
        ],
        question: {
          text: "Wie ist der negative Sensibilitaetstest jetzt zu bewerten?",
          options: [
            {
              label: "Er beweist sofort eine Pulpanekrose",
              correct: false,
              rationale:
                "Nach Trauma ist die Testaussage in der Fruehphase begrenzt.",
              points: 0
            },
            {
              label: "Er ist relevant, muss aber mit Verlauf und Bildgebung kombiniert werden",
              correct: true,
              rationale:
                "Genau diese Kombination ist im Traumafall noetig.",
              points: 120
            },
            {
              label: "Er ist komplett bedeutungslos",
              correct: false,
              rationale:
                "Er ist wichtig, nur nicht isoliert ausreichend.",
              points: 0
            }
          ]
        }
      },
      {
        phase: "Diagnostik",
        title: "Bildgebung und Verlauf",
        prompt:
          "Zur weiteren Klaerung werden klinische Nachkontrolle und Bildgebung geplant.",
        findings: [
          "Keine sichere Kronen-Wurzel-Fraktur sichtbar",
          "Perkussion gering positiv",
          "Roentgen ohne eindeutige apikale Laesion"
        ],
        cheatSheet: [
          "Traumafaelle leben vom Verlauf.",
          "Klinik, Bildgebung und Zeitachse muessen zusammen gelesen werden."
        ],
        question: {
          text: "Welcher Schritt passt am besten?",
          options: [
            {
              label: "Kontrolliertes Follow-up mit erneuter Vitalitaetspruefung und Dokumentation",
              correct: true,
              rationale:
                "So laesst sich die Vitalitaetsentwicklung belastbar absichern.",
              points: 140
            },
            {
              label: "Sofortige Extraktion",
              correct: false,
              rationale:
                "Dafuer ist der aktuelle Befund nicht ausreichend.",
              points: 0
            },
            {
              label: "Nur aesthetische Kompositkorrektur ohne Verlauf",
              correct: false,
              rationale:
                "Das ignoriert das pulpitische Risiko nach Trauma.",
              points: 0
            }
          ]
        }
      },
      {
        phase: "Entscheidung",
        title: "Therapie bei Progress",
        prompt:
          "Vier Wochen spaeter bleibt Zahn 11 sensibel unauffaellig, die Verfaerbung nimmt zu und im Bild zeigt sich eine beginnende apikale Veraenderung.",
        findings: [
          "Persistierende Negativreaktion",
          "Radiologischer Progress",
          "Zahn erhaltungswuerdig"
        ],
        cheatSheet: [
          "Jetzt wird aus Beobachtung eine endodontische Indikation.",
          "Der Fall trainiert bewusst die Schwelle zwischen Kontrolle und Intervention."
        ],
        question: {
          text: "Was ist jetzt primaer angezeigt?",
          options: [
            {
              label: "Endodontische Therapie einleiten",
              correct: true,
              rationale:
                "Der Verlauf spricht nun fuer eine pulpitische bzw. nekrotische Komplikation mit Behandlungsbedarf.",
              points: 160
            },
            {
              label: "Weiter unbegrenzt abwarten",
              correct: false,
              rationale:
                "Der Befund entwickelt sich pathologisch weiter.",
              points: 0
            },
            {
              label: "Nur Bleaching",
              correct: false,
              rationale:
                "Das adressiert die Ursache nicht.",
              points: 0
            }
          ]
        }
      }
    ]
  },
  {
    id: "prothetik-14",
    domain: "Prothetik",
    title: "Teilkrone oder Vollkrone an Zahn 14",
    patient: "Markus W., 57 Jahre",
    difficulty: "Fortgeschritten",
    duration: "9-11 Min.",
    model: "Modell E5",
    summary:
      "Ein stark restaurierter Praemolar verlangt eine differenzierte Entscheidung zwischen Zahnerhalt, Praeparationsdesign und Materialwahl.",
    resources: [
      "3D-Modell E5: Praeparation 14",
      "Video: Schichtstaerken richtig planen",
      "Cheat Sheet: Teilkrone vs. Vollkrone"
    ],
    learningGoals: [
      "Restzahnsubstanz bewerten",
      "Defektorientierte Versorgung waehlen"
    ],
    steps: [
      {
        phase: "Ausgangslage",
        title: "Restzahnsubstanz einschaetzen",
        prompt:
          "Zahn 14 zeigt eine grosse insuffiziente Fuellung mit Frakturlinie eines Hoeckers. Der Zahn ist beschwerdearm und endodontisch unauffaellig.",
        findings: [
          "Ein Hoecker geschwaecht",
          "Restzahnsubstanz noch vorhanden",
          "Keine apikalen Auffaelligkeiten"
        ],
        cheatSheet: [
          "In der Prothetik bestimmt die Restsubstanz das Design.",
          "Nicht reflexhaft maximal invasiv planen."
        ],
        question: {
          text: "Welches Prinzip ist hier am wichtigsten?",
          options: [
            {
              label: "Maximaler Substanzabtrag schafft immer die beste Versorgung",
              correct: false,
              rationale:
                "Das widerspricht dem defektorientierten Vorgehen.",
              points: 0
            },
            {
              label: "Defektorientierte, substanzschonende Planung nach Restzahnbefund",
              correct: true,
              rationale:
                "Genau dieses Prinzip entscheidet zwischen Teilkrone und ausgedehnterer Versorgung.",
              points: 120
            },
            {
              label: "Nur Farbe des Zahns ist ausschlaggebend",
              correct: false,
              rationale:
                "Aesthetik ist relevant, aber nicht das primaere Entscheidungskriterium.",
              points: 0
            }
          ]
        }
      },
      {
        phase: "Praeparation",
        title: "Versorgungsform waehlen",
        prompt:
          "Die Restwaende wirken stabil, die Approximalkontakte muessen teilweise erneuert werden. Eine adhaesive Befestigung ist moeglich.",
        findings: [
          "Substanzschonende Teilversorgung moeglich",
          "Trockenlegung realistisch",
          "Patient legt Wert auf Langlebigkeit"
        ],
        cheatSheet: [
          "Adhaesive Teilkronen profitieren von erhaltener Restsubstanz.",
          "Die App kann hier spaeter Modellschritte fuer Praeparationsgrenzen einblenden."
        ],
        question: {
          text: "Welche Versorgung ist primaer plausibel?",
          options: [
            {
              label: "Adhaesiv befestigte Teilkrone",
              correct: true,
              rationale:
                "Das erhaelt mehr Zahnsubstanz und passt zur beschriebenen Ausgangslage.",
              points: 150
            },
            {
              label: "Extraktion mit Sofortimplantat",
              correct: false,
              rationale:
                "Dafuer fehlt jede Indikation.",
              points: 0
            },
            {
              label: "Gar keine Versorgung trotz Frakturgefahr",
              correct: false,
              rationale:
                "Das ignoriert den strukturellen Schaden.",
              points: 0
            }
          ]
        }
      },
      {
        phase: "Material",
        title: "Materialentscheidung treffen",
        prompt:
          "Der Zahn liegt im Seitenzahnbereich, die Patientenerwartung ist funktionelle Stabilitaet bei guter Aesthetik.",
        findings: [
          "Hohe Kaubelastung",
          "Adhaesives Setting moeglich",
          "Aesthetik relevant, aber sekundaer"
        ],
        cheatSheet: [
          "Materialwahl folgt Funktion, Design und Befestigungskonzept.",
          "Die konkrete Wahl haengt spaeter von Lehrmeinung und Kursrahmen ab."
        ],
        question: {
          text: "Welche Aussage passt am besten?",
          options: [
            {
              label: "Ein vollkeramisches, adhaesiv eingebundenes Konzept ist hier gut begruendbar",
              correct: true,
              rationale:
                "Das verbindet Aesthetik mit funktioneller Seitenzahnversorgung im passenden Indikationsrahmen.",
              points: 140
            },
            {
              label: "Materialwahl ist voellig beliebig",
              correct: false,
              rationale:
                "Sie muss zum Defekt- und Befestigungskonzept passen.",
              points: 0
            },
            {
              label: "Nur ein provisorisches Material ist dauerhaft ausreichend",
              correct: false,
              rationale:
                "Das ist fuer die definitive Versorgung nicht schluessig.",
              points: 0
            }
          ]
        }
      }
    ]
  },
  {
    id: "notfall-38",
    domain: "Notfall",
    title: "Akute Schwellung regio 38",
    patient: "Aylin T., 31 Jahre",
    difficulty: "Fortgeschritten",
    duration: "7-9 Min.",
    model: "Modell F6",
    summary:
      "Ein Notfallfall mit eingeschraenkter Mundoeffnung verlangt Priorisierung von Risiko, Entlastung und weiterem Management.",
    resources: [
      "3D-Modell F6: Weisheitszahnregion",
      "Video: Notfalltriage in der Praxis",
      "Cheat Sheet: Red Flags bei dentogenen Infektionen"
    ],
    learningGoals: [
      "Red Flags erkennen",
      "Notfallmanagement priorisieren"
    ],
    steps: [
      {
        phase: "Triage",
        title: "Gefaehrdung abschaetzen",
        prompt:
          "Die Patientin erscheint mit Schmerzen, Schwellung und eingeschraenkter Mundoeffnung im Bereich des unteren linken Weisheitszahns.",
        findings: [
          "Schwellung regio 38",
          "Mundoeffnung reduziert",
          "Schlucken leicht unangenehm"
        ],
        cheatSheet: [
          "Bei Infektionen gilt zuerst Risikoabschaetzung, dann lokale Massnahme.",
          "Schluckbeschwerden und Trismus muessen ernst genommen werden."
        ],
        question: {
          text: "Was hat jetzt die hoechste Prioritaet?",
          options: [
            {
              label: "Ausbreitungsrisiko und Allgemeinzustand sofort abschaetzen",
              correct: true,
              rationale:
                "Bei dentogenen Infektionen steht die Triage moeglicher Red Flags an erster Stelle.",
              points: 130
            },
            {
              label: "Nur kosmetische Schwellungsreduktion",
              correct: false,
              rationale:
                "Das verfehlt das Notfallziel.",
              points: 0
            },
            {
              label: "Kontrolle in mehreren Wochen",
              correct: false,
              rationale:
                "Dafuer ist der Fall zu akut.",
              points: 0
            }
          ]
        }
      },
      {
        phase: "Diagnostik",
        title: "Lokalen Fokus bestimmen",
        prompt:
          "Klinisch zeigt sich eine teilretinierte 38 mit perikoronarem Entzuendungsbefund. Es gibt aktuell keine Atemprobleme.",
        findings: [
          "Perikoronitis wahrscheinlich",
          "Keine Dyspnoe",
          "Lokaler eitriger Fokus moeglich"
        ],
        cheatSheet: [
          "Notfallmanagement kombiniert Fokusdiagnostik, Schmerzmanagement und Verlaufssicherung.",
          "Red Flags muessen trotzdem fortlaufend geprueft werden."
        ],
        question: {
          text: "Welcher naechste Schritt ist schluessig?",
          options: [
            {
              label: "Lokale Entlastung, Spuelung und engmaschiges Management je nach Befund",
              correct: true,
              rationale:
                "Das entspricht einem strukturierten Vorgehen beim lokal begrenzten perikoronalen Infekt.",
              points: 150
            },
            {
              label: "Ausschliesslich Bleaching",
              correct: false,
              rationale:
                "Das ist offenkundig fachfremd.",
              points: 0
            },
            {
              label: "Keine Massnahme trotz akutem Befund",
              correct: false,
              rationale:
                "Das waere klinisch nicht vertretbar.",
              points: 0
            }
          ]
        }
      },
      {
        phase: "Weiteres Vorgehen",
        title: "Definitiven Plan festlegen",
        prompt:
          "Nach initialer Entlastung bessert sich die Symptomatik. Es soll nun ein sicherer weiterer Behandlungsplan festgelegt werden.",
        findings: [
          "Akute Belastung reduziert",
          "Weisheitszahn weiterhin problematisch",
          "Aufklaerung moeglich"
        ],
        cheatSheet: [
          "Akutentlastung ersetzt nicht die definitive Strategie.",
          "Das Spiel kann hier spaeter mit Zeit- und Sicherheitsbonus arbeiten."
        ],
        question: {
          text: "Welche Aussage passt jetzt am besten?",
          options: [
            {
              label: "Definitive Entfernung nach Akutphase bzw. entsprechender Planung erwaegen und Verlauf sichern",
              correct: true,
              rationale:
                "Das adressiert die Ursache nach der Akutstabilisierung.",
              points: 160
            },
            {
              label: "Den Zahn ohne Verlauf immer belassen",
              correct: false,
              rationale:
                "Die ursachliche Situation bleibt dann bestehen.",
              points: 0
            },
            {
              label: "Nur Ranglistenpunktzahl dokumentieren",
              correct: false,
              rationale:
                "Gamification ist Beiwerk, nicht Therapie.",
              points: 0
            }
          ]
        }
      }
    ]
  }
];

export const PEER_SCORES = [
  { name: "Mira", score: 980 },
  { name: "Jamal", score: 910 },
  { name: "Tobias", score: 860 },
  { name: "Sara", score: 790 },
  { name: "Elif", score: 720 },
  { name: "Lea", score: 650 }
];
