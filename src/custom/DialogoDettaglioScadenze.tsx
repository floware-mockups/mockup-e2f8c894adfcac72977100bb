// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("DialogoDettaglioScadenze");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("DialogoDettaglioScadenze");
import { useState } from "react";
import { Button, Card, Dialog, Field, useTable } from "../floware";

export default function DialogoDettaglioScadenze(props) {__mk();
  const table = useTable(props.pageId);
  const [selezionata, setSelezionata] = useState(-1);
  if (!table) return null;
  const descrizione = table.column("Descrizione");
  if (descrizione < 0) return <p>Colonna Descrizione non disponibile.</p>;
  const campi = ["Descrizione", "Data", "Ufficio", "Responsabile", "Riferimento normativo", "Ricorrenza", "Completata"];
  const riga = table.rows[selezionata];
  function visualizza(nome, valore) {__mk();
    const testo = String(valore || "—");
    if (nome === "Data") {
      if (testo.startsWith("+") || testo.startsWith("-")) {
        const giorni = Number(testo);
        if (isFinite(giorni)) {
          const data = new Date();
          data.setDate(data.getDate() + giorni);
          return data.toLocaleDateString("it-IT");
        }
      }
      if (testo.includes("-")) {
        const data = new Date(testo);
        if (!isNaN(data.getTime())) return data.toLocaleDateString("it-IT");
      }
    }
    if (nome === "Completata" && (testo === "—" || testo === "No" || testo === "false")) return "Non completata";
    return testo;
  }
  return (
    <Card title="Dettaglio delle scadenze">
      <div className="space-y-3">
        <p className="text-(--mk-muted)">Seleziona una riga per consultarne tutti i dati.</p>
        {table.rows.length === 0 && <p>Nessuna scadenza disponibile.</p>}
        {table.rows.map((voce, indice) => (
          (__mk(), <div key={indice} className="flex flex-wrap items-center justify-between gap-3 border-b border-(--mk-divider) py-3">
            <span className="text-(--mk-text)">{voce[descrizione]}</span>
            <Button variant="secondary" onClick={() => (__mk(), setSelezionata(indice))}>Apri dettaglio</Button>
          </div>)
        ))}
      </div>
      {riga && (
        <Dialog title="Dettaglio scadenza" onClose={() => (__mk(), setSelezionata(-1))} footer={<Button onClick={() => (__mk(), setSelezionata(-1))} autoFocus>Chiudi</Button>}>
          <div className="space-y-4">
            {campi.map((nome) => {__mk();
              const indice = table.column(nome);
              return <Field key={nome} label={nome === "Completata" ? "Stato di completamento" : nome}>{indice < 0 ? "Dato non disponibile" : visualizza(nome, riga[indice])}</Field>;
            })}
          </div>
        </Dialog>
      )}
    </Card>
  );
}
