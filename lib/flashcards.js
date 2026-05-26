// Flashcard data for Reti (subjectId: 19)
// Sets and cards extracted from db-flashcard.txt

export const flashcardSets = [
  {
    id: 194,
    name: "1 - Architettura Di Rete",
    cards: [
      {
        id: 195,
        front: "Quali sono gli elementi di base di una rete e come è organizzata gerarchicamente la rete Internet (Backbone)?",
        back: "Elementi di base: Calcolatori (End host), apparati di rete come Router, Switch e Access Point (AP), e collegamenti (LAN). Organizzazione: È strutturata gerarchicamente e amministrata dagli ISP (Internet Service Provider) che operano come AS (Autonomous Systems). È suddivisa in 3 livelli: Internazionale (Livello 1), Nazionale (Livello 2) e Locale (Livello 3).",
      },
      {
        id: 196,
        front: "Come funziona la Commutazione di Circuito, quali tecniche di multiplazione usa e quali sono i pro e contro?",
        back: "Funzionamento: Il percorso è assegnato staticamente e le risorse di trasmissione sono dedicate alla sorgente/destinazione per l'intero scambio. Tecniche: Usa la multiplazione TDM (divisione a slot di tempo) o FDM (divisione per frequenze). Pro: Risorse dedicate e comunicazione continua. Contro: Numero limitato di utenti contemporanei e risorse sprecate se il canale non viene utilizzato.",
      },
      {
        id: 197,
        front: "Qual è il principio alla base della Commutazione di Pacchetto, quale meccanismo utilizzano i router e quali sono i pro e contro?",
        back: "Principio: L'informazione viene suddivisa in pacchetti indipendenti, ciascuno contenente un header con la destinazione. Meccanismo: Usa la tecnica Store and Forward con un Buffer. Pro: Utilizzo efficiente delle risorse. Contro: Introduzione di ritardi e potenziale perdita di pacchetti se il buffer è pieno.",
      },
      {
        id: 198,
        front: "Da quali 4 componenti è formato il ritardo (delay) nei nodi di rete e quale incide maggiormente?",
        back: "Le 4 componenti sono: 1. Elaborazione (tempo per decidere la via d'uscita), 2. Accodamento (tempo di attesa nel buffer prima di essere trasmesso), 3. Trasmissione (dipende dalla dimensione del pacchetto e dalla velocità del link), 4. Propagazione (dipende dalla distanza). La componente che incide di più è solitamente il ritardo di Accodamento.",
      },
      {
        id: 199,
        front: "Che cosa indica l'acronimo RTT (e come si misura) e da cosa è determinata la velocità globale (Throughput) in un trasferimento end-to-end?",
        back: "RTT (Round Trip Time): È il tempo totale di andata e ritorno di un messaggio, che si misura comunemente utilizzando il comando Ping. Throughput: La velocità di trasferimento globale tra due host è determinata dal link con la banda minore, ovvero dal collo di bottiglia che influenza la velocità globale.",
      },
      {
        id: 200,
        front: "Su quale approccio si basa l'architettura di rete a strati e qual è la funzione principale di un Header?",
        back: "Approccio: Si basa sul Divide et Impera per risolvere il problema della comunicazione separando la comunicazione logica da quella fisica. Header: Ad ogni livello, il messaggio viene elaborato aggiungendo un'intestazione che contiene informazioni di controllo come la destinazione o i numeri di sequenza. L'insieme di questi protocolli è chiamato Stack Protocollare.",
      },
      {
        id: 201,
        front: "Qual è il significato dell'acronimo ISO/OSI e da quali 7 livelli è composto questo modello teorico?",
        back: "ISO: International Organization for Standardization. OSI: Open System Intercommunication. È composto da 7 Livelli: Applicazione, Presentazione, Sessione, Trasporto, Rete, Collegamento Dati, Fisico.",
      },
      {
        id: 202,
        front: "Da quanti livelli è formato lo stack TCP/IP, quali sono, e da dove deriva il suo nome?",
        back: "Il nome deriva dai due protocolli principali utilizzati nei suoi strati: TCP (Trasporto) e IP (Rete). È composto da 5 Livelli: Applicazione, Trasporto, Rete, Collegamento Dati, Fisico.",
      },
      {
        id: 203,
        front: "Che differenza c'è, a livello di calcolatore, tra un'applicazione generale e l'entità che effettivamente comunica in rete?",
        back: "Sul calcolatore possono essere attive contemporaneamente più applicazioni (es. Browser) e più istanze della stessa applicazione (es. diverse Tab). L'entità specifica che comunica in rete è definita come il singolo Processo in esecuzione sul calcolatore.",
      },
      {
        id: 204,
        front: "Come viene identificato in modo univoco un processo su Internet? Cos'è una Tupla?",
        back: "Un processo è identificato dalla combinazione dell'Indirizzo IP (che identifica il calcolatore a Livello di Rete) e dal codice della Porta (che identifica il processo al Livello di Trasporto). Un flusso di comunicazione è identificato in modo univoco da una Tupla composta da: IP Sorgente, IP Destinazione, Porta Sorgente, Porta Destinazione.",
      },
    ],
  },
  {
    id: 205,
    name: "2 - Indirizzi IP",
    cards: [
      {
        id: 206,
        front: "Com'è strutturato un indirizzo IPv4 e cosa indicano Prefisso e Suffisso?",
        back: "Un indirizzo IPv4 è formato da 32 bit, generalmente rappresentati in notazione decimale puntata (4 blocchi da 8 bit). È diviso in due parti: il Prefisso identifica la rete specifica, mentre il Suffisso identifica in modo univoco l'host all'interno di quella rete.",
      },
      {
        id: 207,
        front: "Quali sono le 4 tipologie di indirizzi IPv4 riservati (non assegnabili a un host)?",
        back: "1) This host: tutti i 32 bit a zero (0.0.0.0). 2) Local Broadcast: tutti i 32 bit a uno (255.255.255.255). 3) Indirizzo di Rete: tutti i bit del suffisso sono a zero. 4) Directed Broadcast: tutti i bit del suffisso sono a uno.",
      },
      {
        id: 208,
        front: "Cos'è la Subnet Mask (Netmask) e a cosa serve l'operazione di AND bit a bit?",
        back: "La Subnet Mask è una sequenza di 32 bit in cui i bit associati al prefisso sono posti a 1 e quelli del suffisso a 0. Eseguendo un'operazione di AND logico bit a bit tra l'indirizzo IP e la Netmask, si ottiene l'indirizzo della rete a cui quell'IP appartiene.",
      },
      {
        id: 209,
        front: "Come si definisce il Subnetting e qual è il principio pratico per applicarlo?",
        back: "Il Subnetting è la suddivisione logica di una rete principale in più sottoreti. Nella pratica, si realizza 'rubando' (prendendo in prestito) alcuni bit dal suffisso e associandoli al prefisso, in modo da creare blocchi di indirizzi più piccoli.",
      },
      {
        id: 210,
        front: "Cos'è l'indirizzamento CIDR e perché si differenzia da quello Classful?",
        back: "Il CIDR (Classless Inter-Domain Routing) permette l'uso di prefissi di lunghezza variabile (indicati con la notazione /xx, es. /16 o /24). Si differenzia dall'indirizzamento Classful storico, il quale prevedeva lunghezze di prefisso rigide (Classi A, B, C) predeterminate dai primissimi bit dell'indirizzo.",
      },
      {
        id: 211,
        front: "Come si riconoscono le Classi A, B e C nell'indirizzamento Classful storico?",
        back: "Classe A: Inizia con il bit 0 (prefisso fisso di 8 bit). Classe B: Inizia con i bit 10 (prefisso fisso di 16 bit). Classe C: Inizia con i bit 110 (prefisso fisso di 24 bit).",
      },
    ],
  },
  {
    id: 212,
    name: "3 - Livello Applicativo",
    cards: [
      {
        id: 213,
        front: "A livello applicativo, come si sceglie tra i protocolli di trasporto TCP e UDP?",
        back: "La scelta dipende dal tipo di servizio: si usa il TCP quando serve un servizio connection-oriented e affidabile che garantisca la consegna dei dati senza perdite (es. Web/HTTP). Si usa l'UDP quando serve un servizio connectionless e non affidabile, preferito da applicazioni che tollerano la perdita di pacchetti come audio/video streaming.",
      },
      {
        id: 214,
        front: "Cos'è un Socket e quali sono i ruoli dei processi (Client/Server) che lo utilizzano?",
        back: "Il Socket è un'astrazione software che identifica un flusso informativo bidirezionale; per aprirlo occorre specificare protocollo, IP e Porte (sorgente e destinazione). I ruoli sono due: il Client è il processo che inizia la comunicazione, mentre il Server è il processo in ascolto in attesa di connessioni.",
      },
      {
        id: 215,
        front: "Come definiresti il protocollo HTTP e a cosa servono i metodi GET, POST e DELETE?",
        back: "L'HTTP è un protocollo testuale basato sul modello Richiesta-Risposta. GET: Richiede e scarica un file/pagina dal server. POST: Invia informazioni o dati dal client al server. DELETE: Cancella informazioni sul server.",
      },
      {
        id: 216,
        front: "Com'è strutturato un messaggio di Risposta HTTP e cosa indicano i codici 200, 400 e 404?",
        back: "La risposta contiene una Riga di Stato (con codice e descrizione), righe di Intestazione (Header) e infine i Dati/Payload (la pagina HTML). 200: OK (richiesta completata). 400: Bad Request (errore del client). 404: Not Found (risorsa non trovata).",
      },
      {
        id: 217,
        front: "Dato che HTTP è un protocollo \"stateless\" (senza stato), come fanno i server a ricordarsi degli utenti?",
        back: "Tramite i Cookie. Il server genera un codice univoco e lo invia al client tramite l'header Set-Cookie: 1234. Nelle richieste successive, il browser del client include l'header Cookie: 1234, permettendo al server di riconoscere l'utente e fornire una navigazione personalizzata.",
      },
      {
        id: 218,
        front: "Qual è la differenza tra connessioni persistenti/non persistenti in HTTP e come il Caching gestisce le pagine scadute?",
        back: "Non persistenti: Il socket viene chiuso dopo ogni singola operazione (es. scaricato un file). Persistenti: Il socket rimane aperto per scambiare più oggetti in sequenza. Il Caching usa server intermedi per salvare le pagine e ridurre il carico di rete. Per verificare se un contenuto in cache è obsoleto (stale), usa la richiesta condizionale con l'header IF-MODIFIED-SINCE.",
      },
      {
        id: 219,
        front: "Qual è lo scopo del DNS, com'è strutturata la sua architettura e a quale server si interfaccia il client?",
        back: "Il DNS traduce i nomi logici dei domini (es. www.google.it) nei corrispondenti indirizzi IP numerici. L'architettura è distribuita e gerarchica (Server Root, TLD e Locali). Il client fa sempre e solo affidamento al Server DNS Locale; invia a lui la query, e sarà quest'ultimo a farsi carico di interrogare il resto della gerarchia.",
      },
      {
        id: 220,
        front: "Quali sono e a cosa servono i 3 protocolli principali per la gestione della posta elettronica (SMTP, POP, IMAP)?",
        back: "SMTP (Simple Mail Transfer Protocol): Utilizzato per l'invio delle email dal client al server e per il trasferimento tra server. POP e IMAP: Utilizzati per la ricezione e la consultazione delle email scaricandole dal server al client.",
      },
    ],
  },
  {
    id: 221,
    name: "4 - Livello Di Trasporto",
    cards: [
      {
        id: 222,
        front: "Qual è il ruolo del Livello di Rete e quali sono i campi fondamentali dell'Header IPv4 (Identification, TTL, Type)?",
        back: "Si occupa dell'instradamento logico (routing) dei pacchetti. È un protocollo inaffidabile e connectionless. Campi: Identification identifica univocamente un datagramma. TTL (Time To Live) è un contatore decrementato a ogni router per evitare loop infiniti. Type (Protocol) indica a quale protocollo superiore (es. TCP/UDP) consegnare il payload.",
      },
      {
        id: 223,
        front: "Cos'è l'MTU? Come funziona la frammentazione (Flag M e Fragment Offset) e dove avviene il riassemblaggio?",
        back: "L'MTU è la dimensione massima supportata da un collegamento. Se pacchetto > MTU, il router lo frammenta. Tutti i frammenti hanno lo stesso Identification. Il Flag M (More Fragments) è a 1 per tutti tranne l'ultimo. Il Fragment Offset indica la posizione del frammento. Il riassemblaggio avviene esclusivamente nell'host di destinazione finale.",
      },
      {
        id: 224,
        front: "Qual è la differenza tra Consegna Diretta e Consegna Indiretta nel protocollo IP?",
        back: "Consegna Diretta: Mittente e destinatario sono sulla stessa sottorete; il pacchetto viene inviato direttamente usando il MAC address locale. Consegna Indiretta: Il destinatario è su una rete diversa; il pacchetto viene inviato al router predefinito (Default Gateway), che userà la sua Tabella di Routing per instradarlo.",
      },
      {
        id: 225,
        front: "Come funzionano e quali algoritmi matematici usano i protocolli Link State (LS) e Distance Vector (DV)?",
        back: "Link State (LS): Ogni router ha la mappa completa della topologia di rete e usa l'algoritmo di Dijkstra per calcolare i percorsi minimi. Distance Vector (DV): I router non hanno una mappa globale, ma si scambiano le stime delle distanze solo con i vicini diretti, calcolando i percorsi iterativamente con l'algoritmo di Bellman-Ford.",
      },
      {
        id: 226,
        front: "Come viene scalato il routing su Internet tramite i Sistemi Autonomi (AS) e qual è il ruolo del Gateway?",
        back: "Intra-AS: Instradamento all'interno di uno stesso Sistema Autonomo usando lo stesso algoritmo (es. OSPF/RIP). Inter-AS: Instradamento tra Sistemi Autonomi diversi (es. BGP). Il Gateway Router è il router di confine che collega l'AS locale con l'esterno, scambiando informazioni con altri AS.",
      },
      {
        id: 227,
        front: "A cosa serve il protocollo ICMP e quali sono le 4 fasi (DORA) del protocollo DHCP?",
        back: "ICMP: Gestisce la diagnostica e gli errori a livello di rete (es. TTL scaduto, host irraggiungibile), usato da Ping e Traceroute. DHCP: Assegna dinamicamente gli IP in 4 fasi DORA: 1) Discover (client cerca server), 2) Offer (server offre IP), 3) Request (client richiede formalmente l'IP), 4) Acknowledge (server conferma e assegna l'IP).",
      },
      {
        id: 228,
        front: "Come si risolve la carenza di indirizzi IPv4 utilizzando gli indirizzi IP Privati e il meccanismo NAT?",
        back: "Gli IP Privati (es. 192.168.x.x) sono validi solo nelle reti locali e non instradabili su Internet. Il NAT (Network Address Translation) sul router di confine sostituisce l'IP privato e porta locale con l'IP pubblico del router e una nuova porta, salvando le mappature nella NAT Translation Table per instradare le risposte di ritorno.",
      },
      {
        id: 229,
        front: "Quali sono le 3 grandi novità introdotte dal protocollo IPv6 per superare i limiti dell'IPv4?",
        back: "1) Indirizzi a 128 bit (esadecimali), risolvendo la carenza di IP. 2) Header Semplificato: lunghezza fissa di 40 byte, rendendo l'elaborazione nei router molto più rapida. 3) Nessuna Frammentazione nei Router: i router scartano i pacchetti troppo grandi e inviano un errore ICMP; la frammentazione è a carico del mittente.",
      },
      {
        id: 230,
        front: "Qual è il problema principale del \"NAT Traversal\" (Attraversamento del NAT) e come si risolve con Port Forwarding e UPnP?",
        back: "Il problema è che un host esterno non può iniziare una connessione verso un host interno a una rete privata. Si risolve con: 1) Port Forwarding (configurazione manuale sul router di una porta pubblica verso l'IP interno) o 2) UPnP (protocollo che permette all'host di richiedere automaticamente al router l'apertura e la mappatura di una porta).",
      },
      {
        id: 231,
        front: "Come comunicano due host se entrambi si trovano dietro a reti private (NAT diverse), e che ruolo hanno il Directory Server e il Relay Server?",
        back: "Si usa la tecnica del Relaying. 1) Directory Server (pubblico): gli host vi si collegano per registrarsi e cercarsi. 2) Server di Relay (pubblico): poiché i due host non possono collegarsi direttamente, aprono entrambi una connessione verso il Relay Server. Questo server funge da ponte bidirezionale, ricevendo i pacchetti da un utente e inoltrandoli all'altro.",
      },
    ],
  },
];

// Helper: get all Reti cards flat
export function getAllCards() {
  return flashcardSets.flatMap((set) =>
    set.cards.map((card) => ({ ...card, setName: set.name, setId: set.id }))
  );
}

// Helper: shuffle array (Fisher-Yates)
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
