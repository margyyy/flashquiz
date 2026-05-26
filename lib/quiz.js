// Quiz questions extracted from RETI-QUIZ screenshots
// Ordered by filename timestamp (021555 → 023235)
// Correct answer = most votes, or green-highlighted answer

export const quizQuestions = [
  {
    id: 1,
    question: "Quale di questi elementi non fa parte dell'architettura di rete?",
    options: [
      "Router",
      "Alimentatori",
      "Collegamenti (cavi, wireless)",
      "Host",
    ],
    correct: 1, // index 0-based: "Alimentatori"
  },
  {
    id: 2,
    question: "Un ISP di livello 2:",
    options: [
      "È collegato solo ad ISP di livello 1",
      "È collegato solo ad ISP di livello 3",
      "Può essere collegato a ISP di livello 2",
      "È collegato ad altri ISP, non a LAN",
    ],
    correct: 2, // "Può essere collegato a ISP di livello 2"
  },
  {
    id: 3,
    question: "Nella commutazione di...",
    options: [
      "...pacchetto i ritardi dipendono dal numero di router attraversati",
      "...circuito le risorse sono usate in modo efficiente",
      "...pacchetto l'informazione trasmessa è pari a quella generata",
      "...pacchetto i router separano i pacchetti in base a chi li ha trasmessi",
    ],
    correct: 0,
  },
  {
    id: 4,
    question: "Quale componente influisce maggiormente sul ritardo?",
    options: [
      "Elaborazione al nodo",
      "Accodamento",
      "Trasmissione",
      "Propagazione",
    ],
    correct: 1, // "Accodamento"
  },
  {
    id: 5,
    question: "Il ritardo di accodamento alla porta \"i\"",
    options: [
      "È influenzato principalmente dal carico sul link di ingresso alla porta \"i\"",
      "Cresce se più porte di ingresso hanno carico per la porta di uscita \"i\"",
      "È influenzato dal carico sulle altre porte di uscita",
      "Dipende dal carico sul router successivo collegato alla porta \"i\"",
    ],
    correct: 1,
  },
  {
    id: 6,
    question: "Il Round Trip Time:",
    options: [
      "È il tempo che intercorre tra l'invio di un messaggio e la ricezione del relativo riscontro",
      "È il tempo di invio di un pacchetto, dalla sorgente alla destinazione",
      "Se mando due pacchetti consecutivi, rimane pressoché costante",
      "È il tempo di invio, moltiplicato per 2",
    ],
    correct: 0,
  },
  {
    id: 7,
    question: "Il percorso seguito dai messaggi TRACEROUTE:",
    options: [
      "Dato un numero di hop, è lo stesso per le 3 richieste inviate",
      "Dato un numero di hop, le risposte seguono lo stesso percorso delle richieste",
      "All'aumentare del numero di hop, misuro sempre ritardi crescenti",
      "All'aumentare del numero di hop, il percorso potrebbe cambiare",
    ],
    correct: 3,
  },
  {
    id: 8,
    question: "Il throughput end-to-end:",
    options: [
      "È il ritardo medio tra sorgente e destinazione",
      "È determinato dal link più lungo",
      "È determinato dal link con banda più piccola",
      "È la velocità di trasmissione del collegamento wireless",
    ],
    correct: 2,
  },
  {
    id: 9,
    question: "Qual è l'ordine dei livelli protocollari nel TCP/IP?",
    options: [
      "Applicazione - Rete - Trasporto - Collegamento dati - Fisico",
      "Applicazione - Trasporto - Rete - Collegamento dati - Fisico",
      "Applicazione - Trasporto - Collegamento dati - Rete - Fisico",
      "Applicazione - Rete - Collegamento dati - Fisico - Trasporto",
    ],
    correct: 1,
  },
  {
    id: 10,
    question: "Perché l'indirizzo IP è logicamente separato in prefisso e suffisso?",
    options: [
      "Per facilitare l'instradamento",
      "Per identificare più facilmente le reti aziendali da quelle domestiche",
      "Per facilitare l'assegnamento ai singoli utenti",
      "Per identificare le aree geografiche degli utenti",
    ],
    correct: 0,
  },
  {
    id: 11,
    question: "Quale opzione rappresenta un indirizzo IP valido?",
    options: [
      "157.27.4.255.0",
      "198.264.147.84",
      "41.125.12.00010011",
      "1.1.1.1",
    ],
    correct: 3,
  },
  {
    id: 12,
    question: "La rete 76.120.144.0/21 contiene:",
    options: [
      "2²¹ (2097152) indirizzi",
      "2¹¹ (2048) indirizzi",
      "11 sottoreti",
      "2²¹ (2097152) reti",
    ],
    correct: 1,
  },
  {
    id: 13,
    question: "La maschera \"11111111 11111111 11111111 11110000\" a cosa corrisponde in notazione barrata?",
    options: ["/28", "/30", "/24", "/4"],
    correct: 0,
  },
  {
    id: 14,
    question: "Quale informazione è presente sia nella Request che nella Response di un messaggio HTTP?",
    options: [
      "Versione HTTP",
      "Metodo (GET, PUT, ...)",
      "Host",
      "Nessuna delle altre opzioni",
    ],
    correct: 0,
  },
  {
    id: 15,
    question: "Nella comunicazione tra due calcolatori:",
    options: [
      "È il processo client che inizia la procedura",
      "È l'applicazione client che inizia la procedura",
      "Il processo server accetta tutte le richieste di apertura di un socket",
      "La macchina su cui gira il server è sempre raggiungibile",
    ],
    correct: 0,
  },
  {
    id: 16,
    question: "Una cache di rete...",
    options: [
      "Serve per rendere sicura una rete",
      "Diminuisce il tempo medio di accesso alle risorse",
      "Funziona solamente con HTTP, non HTTPS",
      "Si occupa di instradare il traffico HTTP verso il server di origine",
    ],
    correct: 1,
  },
  {
    id: 17,
    question: "Il server DNS...",
    options: [
      "È un server che tiene traccia delle coppie hostname / indirizzo IP degli utenti di quella rete",
      "Si occupa di tradurre gli hostname in indirizzi IP",
      "È un processo che viene eseguito sul proprio calcolatore",
      "Si occupa di instradare i pacchetti verso l'hostname richiesto",
    ],
    correct: 1,
  },
  {
    id: 18,
    question: "I numeri di porta nel TCP identificano ___________ coinvolte/i nello scambio di messaggi:",
    options: ["Le reti", "Le applicazioni", "Le istanze delle applicazioni", "Gli host"],
    correct: 2,
  },
  {
    id: 19,
    question: "Nel TCP, le porte...",
    options: [
      "...statiche sono associate alle applicazioni più diffuse",
      "...statiche sono usate solo come porta destinazione",
      "...dinamiche sono associate ad applicazioni poco usate",
      "...dinamiche possono essere usate sia come porta sorgente che come porta destinazione",
    ],
    correct: 3, // Green-highlighted in follow-up screenshot
  },
  {
    id: 20,
    question: "Nell'esercizio con le 3 LAN da 300, 40 e 90 host, il blocco CIDR dell'intera rete è:",
    options: [
      "148.12.72.0 / 21",
      "148.12.76.0 / 22",
      "148.12.78.0 / 23",
      "148.12.79.128 / 24",
      "Nessuna delle precedenti",
    ],
    correct: 1,
  },
  {
    id: 21,
    question: "Nell'esercizio con le 3 LAN da 300, 40 e 90 host, l'indirizzo di rete della LAN1 è:",
    options: [
      "148.12.72.0 / 22",
      "148.12.76.0 / 23",
      "148.12.78.0 / 24",
      "148.12.79.128 / 25",
      "Nessuna delle precedenti",
    ],
    correct: 1,
  },
  {
    id: 22,
    question: "Il TCP è un protocollo connection-oriented: questo implica che...",
    options: [
      "Venga riservato un circuito prima di poter scambiare segmenti",
      "I segmenti persi vengano recuperati",
      "I segmenti seguano tutti lo stesso percorso",
      "I segmenti vengano riordinati prima di essere consegnati al livello applicativo",
    ],
    correct: 3, // Green-highlighted
  },
  {
    id: 23,
    question: "Nella fase di instaurazione della connessione del TCP:",
    options: [
      "Il messaggio di SYN potrebbe non ottenere una risposta",
      "Il three-way handshake deve essere eseguito indipendentemente da entrambi gli host coinvolti",
      "Il three-way handshake è iniziato dal server",
      "Viene scelto in modo casuale un numero di sequenza iniziale da cui entrambi gli host iniziano a numerare i byte",
    ],
    correct: 0, // Green-highlighted
  },
  {
    id: 24,
    question: "La fase di chiusura di una connessione TCP:",
    options: [
      "È obbligatoria",
      "Ad un messaggio di FIN, l'altro host risponde sempre con un messaggio di ACK",
      "È iniziata sempre dal client",
      "Deve essere eseguita indipendentemente da entrambi gli host",
    ],
    correct: 3, // Green-highlighted
  },
  {
    id: 25,
    question: "Il TCP è un protocollo affidabile: questo implica che...",
    options: [
      "Vengano riservate delle risorse di rete prima di poter scambiare segmenti",
      "I segmenti persi vengano recuperati",
      "I segmenti vengano riordinati prima di essere consegnati al livello applicativo",
      "I segmenti seguano tutti lo stesso percorso",
    ],
    correct: 1,
  },
  {
    id: 26,
    question: "Il Round Trip Time (RTT) nel TCP:",
    options: [
      "Dipende dal numero di router attraversati",
      "È calcolato solo durante il three-way handshake",
      "Rimane costante per tutta la connessione",
      "È il tempo che impiega un pacchetto ad andare dalla sorgente alla destinazione, moltiplicato per 2",
    ],
    correct: 0,
  },
  {
    id: 27,
    question: "Nel TCP, il numero di sequenza indica:",
    options: [
      "L'indice del primo byte del payload rispetto ad un riferimento",
      "Quanti byte l'applicazione ha inviato fino a quel momento",
      "Un numero casuale",
      "Quanti pacchetti sono stati inviati fino a quel momento",
    ],
    correct: 0,
  },
  {
    id: 28,
    question: "Nel TCP, l'acknowledge (ACK) number indica:",
    options: [
      "Il numero di pacchetti ricevuti fino a quel momento",
      "Quanti byte l'applicazione ha ricevuto fino a quel momento",
      "Un numero casuale",
      "Il primo byte che ci si aspetta di ricevere nel prossimo pacchetto",
    ],
    correct: 3,
  },
  {
    id: 29,
    question: "In una connessione TCP solo uno dei due processi sta inviando dati (l'altro risponde con gli ACK): come vengono impostati i seguenti campi?",
    options: [
      "Chi invia, non dovendo riscontrare nulla, lascia a 0 i bit dell'acknowledge number",
      "Chi riceve, userà sempre il checksum per verificare l'integrità dei dati ricevuti",
      "Chi riceve, non dovendo inviare nulla, lascia a 0 i bit del sequence number",
      "Chi invia, non dovendo riscontrare nulla, non userà mai il flag di ACK",
    ],
    correct: 1,
  },
  {
    id: 30,
    question: "Il campo Time To Live (TTL) dell'header del protocollo IP contiene:",
    options: [
      "Il numero di secondi entro cui consegnare il pacchetto",
      "Il numero massimo di router che si possono ancora attraversare",
      "L'istante dopo il quale il pacchetto non è più valido",
      "Il numero di router attraversati",
    ],
    correct: 1,
  },
  {
    id: 31,
    question: "Il campo \"Checksum\" dell'header del protocollo IP contiene:",
    options: [
      "Il numero di bit uguali a 1 presenti nell'header",
      "Il numero di errori di trasmissione accumulati lungo il percorso",
      "Un identificativo univoco per ogni pacchetto",
      "Il risultato di un'operazione fatta usando come input i bit dell'header stesso",
    ],
    correct: 3,
  },
  {
    id: 32,
    question: "Se un pacchetto ha il flag M pari a 0...",
    options: [
      "Potrebbe essere il primo di una serie di frammenti",
      "Potrebbe non essere un frammento, ma un pacchetto intero",
      "Si tratta sicuramente di un frammento intermedio",
      "Si tratta dell'ultimo frammento di un pacchetto frammentato",
    ],
    correct: 1,
  },
  {
    id: 33,
    question: "Se un pacchetto ha il flag M pari a 1...",
    options: [
      "Potrebbe essere il primo di una serie di frammenti",
      "Potrebbe non essere un frammento, ma un pacchetto intero",
      "Si tratta sicuramente di un frammento intermedio",
      "Si tratta dell'ultimo frammento di un pacchetto frammentato",
    ],
    correct: 0,
  },
  {
    id: 34,
    question: "Se ricevo un pacchetto con campo offset pari a 100 e flag M pari a 0, posso risalire alla dimensione totale del pacchetto intero originario?",
    options: [
      "Se M è a zero, il pacchetto non è stato frammentato",
      "No, non è possibile, non sapendo quanti altri frammenti ci sono",
      "Con le altre informazioni contenute nell'header, sì",
      "Solo se ho già ricevuto gli altri frammenti",
    ],
    correct: 2,
  },
  {
    id: 35,
    question: "Il riassemblaggio dei frammenti avviene:",
    options: [
      "Al router della rete di destinazione",
      "Al calcolatore di destinazione",
      "Solo se si recuperano eventuali frammenti persi",
      "Al router solo se la MTU dell'hop successivo è maggiore della MTU dell'hop precedente",
    ],
    correct: 1,
  },
  {
    id: 36,
    question: "Qual è lo scopo del livello di rete?",
    options: [
      "Consegnare i messaggi alla destinazione",
      "Consegnare correttamente tutti i messaggi, recuperando le perdite",
      "Instradare i messaggi lungo il percorso più breve",
      "Consegnare alla destinazione i messaggi nel corretto ordine rispetto a quanto inviato dalla sorgente",
    ],
    correct: 0, // Green-highlighted
  },
  {
    id: 37,
    question: "Gli algoritmi di routing si occupano di instradare sempre i pacchetti:",
    options: [
      "Sul percorso più breve",
      "Sul percorso più rapido",
      "Sul percorso meno carico",
      "Sul percorso a costo minimo",
    ],
    correct: 3,
  },
  {
    id: 38,
    question: "Le tabelle di routing, usate dai router per decidere dove instradare un pacchetto:",
    options: [
      "Vengono impostate dagli amministratori di rete",
      "Individuano sempre il cammino minimo",
      "Vengono popolate dagli algoritmi di routing",
      "Indicano i costi di tutti i collegamenti della rete",
    ],
    correct: 2,
  },
  {
    id: 39,
    question: "Se un router adotta un algoritmo di routing basato su Link State:",
    options: [
      "Per poter calcolare i cammini minimi, deve conoscere tutti i router del proprio ISP",
      "Quando un collegamento si guasta, deve informare tutti i vicini con le nuove tabelle di routing",
      "Non ci possono essere routing loop",
      "Conosce sempre il miglior next hop per raggiungere le varie destinazioni",
    ],
    correct: 0, // Green-highlighted
  },
  {
    id: 40,
    question: "Gli algoritmi basati su distance vector assumono di conoscere:",
    options: [
      "I costi dei collegamenti diretti",
      "La topologia globale della rete",
      "I costi associati a ciascun collegamento del grafo",
      "Il numero di collegamenti in uscita dai propri vicini",
    ],
    correct: 0,
  },
  {
    id: 41,
    question: "Se un router adotta un algoritmo di routing basato su Distance Vector:",
    options: [
      "Quando viene acceso per la prima volta, deve conoscere tutti i router della rete",
      "Quando un collegamento si guasta, deve informare tutti i vicini",
      "Conosce l'intero cammino che un pacchetto seguirà per arrivare a destinazione",
      "Conosce sempre il miglior next hop per raggiungere le varie destinazioni",
    ],
    correct: 1,
  },
  {
    id: 42,
    question: "Se un router deve impostare una riga nella tabella di routing per una destinazione esterna all'AS a cui appartiene, baserà la scelta:",
    options: [
      "Sul cammino a costo minimo",
      "In base al router di bordo che può raggiungere la destinazione più vicino alla destinazione",
      "In base al router di bordo che può raggiungere la destinazione più vicino a sé stesso",
      "In base al livello gerarchico dell'ISP di destinazione",
    ],
    correct: 2,
  },
  {
    id: 43,
    question: "Il campo TTL dell'header IP:",
    options: [
      "Con i protocolli basati su algoritmi di instradamento Link State non ha più utilità",
      "Serve per evitare che un pacchetto occupi risorse in caso di routing loop",
      "Con i protocolli basati su algoritmi di instradamento Distance Vector e le attuali velocità di trasmissione non ha più utilità",
      "È influenzato da BGP",
    ],
    correct: 1,
  },
  {
    id: 44,
    question: "Il campo \"Service type\" dell'header IP può essere usato per assegnare classi di servizio ai pacchetti. Quale di queste affermazioni è corretta?",
    options: [
      "La priorità è usata per instradare su percorsi diversi il traffico",
      "La priorità è usata in modo omogeneo tra diversi ISP / AS",
      "La priorità viene usata solo all'interno del singolo ISP / AS",
      "Pacchetti ad alta priorità riescono ad evitare routing loop",
    ],
    correct: 2,
  },
  {
    id: 45,
    question: "Il DHCP (Dynamic Host Configuration Protocol):",
    options: [
      "Traduce gli indirizzi logici in indirizzi IP",
      "Instrada i pacchetti verso il router di bordo per la consegna indiretta",
      "Determina la maschera da assegnare ad una rete in base al numero di utenti",
      "Allo scadere del tempo di lease, può non rinnovare l'indirizzo IP assegnato",
    ],
    correct: 3,
  },
  {
    id: 46,
    question: "Gli indirizzi IP privati:",
    options: [
      "Permettono di usare lo stesso blocco in reti diverse",
      "Si possono usare solo se c'è un router collegato ad Internet con un indirizzo IP pubblico",
      "Permettono la comunicazione verso il router, ma non tra host della stessa rete",
      "Non permettono il subnetting",
    ],
    correct: 0,
  },
  {
    id: 47,
    question: "La funzionalità di NAT (Network Address Translation):",
    options: [
      "Traduce indirizzi logici in indirizzi IP",
      "Può permettere la comunicazione da un host con IP pubblico verso un host con IP privato",
      "Non può essere usata su un router che collega due reti private",
      "Non può essere usata su un router che collega due reti pubbliche",
    ],
    correct: 1,
  },
  {
    id: 48,
    question: "Nell'esercizio 2 del TE 24/09/2019, il blocco CIDR totale è:",
    options: [
      "46.144.140.0/22",
      "46.144.141.0/22",
      "46.144.140.0/23",
      "46.144.141.0/23",
    ],
    correct: 0,
  },
  {
    id: 49,
    question: "Nell'esercizio 2 del TE 24/09/2019, l'indirizzo di rete della LAN2 è:",
    options: [
      "46.144.143.0/23",
      "46.144.143.0/24",
      "46.144.142.0/23",
      "46.144.142.0/24",
    ],
    correct: 2,
  },
  {
    id: 50,
    question: "Si assuma di avere un router con 4 interfacce, 2 verso Internet (con IP pubblici) e 2 verso reti interne private:",
    options: [
      "Il NAT può essere attivato solo su una delle due interfacce verso Internet",
      "Per un pacchetto originato da una rete privata, prima viene fatto il NAT, poi l'instradamento",
      "Le due reti private non possono comunicare tra di loro se non è attivo il NAT",
      "Un router non può avere una tale configurazione",
      "Nessuna delle precedenti",
    ],
    correct: 4,
  },
  {
    id: 51,
    question: "Nell'header di base del protocollo IPv6:",
    options: [
      "La dimensione è fissa",
      "Gli indirizzi IP sorgente e destinazione hanno dimensione fino a 128 bit",
      "Il campo \"Next Header\" indica sempre il protocollo trasportato nel payload",
      "Il campo \"Next Header\" indica, se è maggiore di zero, che il pacchetto è un frammento",
    ],
    correct: 0,
  },
  {
    id: 52,
    question: "Gli Extension Header nel protocollo IPv6:",
    options: [
      "Hanno dimensione fissa",
      "Hanno un campo \"Next Header\" che può indicare il protocollo trasportato nel payload",
      "Hanno un campo \"Next Header\" che può indicare la propria tipologia di \"Extension Header\"",
      "Vengono sempre elaborati da tutti i router",
    ],
    correct: 1,
  },
  {
    id: 53,
    question: "Se ci sono due LAN che adottano IPv6, collegate attraverso Internet (che adotta IPv4), è possibile far comunicare un host di una LAN con un host dell'altra LAN?",
    options: [
      "Sì, se il router di bordo sostituisce l'header IPv6 con un header IPv4 (e viceversa)",
      "Sì, se il router di bordo incapsula il pacchetto IPv6 in un pacchetto IPv4",
      "No, perché le tabelle di routing non possono contenere indirizzi IPv4 e IPv6",
      "No, perché due protocolli di livello 3 diversi non possono convivere",
    ],
    correct: 1,
  },
  {
    id: 54,
    question: "Nell'algoritmo di accesso al mezzo basato su ALOHA:",
    options: [
      "La stazione ascolta il canale prima di trasmettere e, se è occupato, aspetta che si liberi",
      "La stazione ascolta il canale mentre trasmette e, se c'è collisione, interrompe la trasmissione",
      "La stazione ascolta il canale mentre trasmette e, se c'è collisione, ritrasmette appena il canale si libera",
      "La stazione ascolta il canale mentre trasmette e, se c'è collisione, ritrasmette dopo un tempo scelto casualmente",
    ],
    correct: 3,
  },
  {
    id: 55,
    question: "Il periodo di vulnerabilità in ALOHA è influenzato:",
    options: [
      "Dal numero di stazioni in una rete",
      "Dall'istante di inizio trasmissione di una trama",
      "Dalla velocità di trasmissione",
      "Dal numero di collisioni subite",
    ],
    correct: 2,
  },
  {
    id: 56,
    question: "Nell'algoritmo Carrier Sense Multiple Access (CSMA):",
    options: [
      "Se una stazione deve trasmettere una trama, la trasmette direttamente sul canale",
      "Se la stazione ascolta il canale e lo trova occupato, aspetta che il canale si liberi e poi potrebbe trasmettere direttamente",
      "Se c'è collisione, la stazione trasmette quando il canale si libera",
      "Non ci può essere collisione",
    ],
    correct: 1,
  },
  {
    id: 57,
    question: "Come fa una stazione che invia una trama su un mezzo condiviso ad accorgersi che c'è stata una collisione?",
    options: [
      "Non riceve l'Ack",
      "Percepisce una potenza sul canale inferiore a quanto trasmesso a causa dell'interferenza distruttiva",
      "Percepisce una potenza sul canale superiore a quanto trasmesso",
      "Una volta demodulato il segnale alla destinazione, il checksum è errato",
    ],
    correct: 2,
  },
];
