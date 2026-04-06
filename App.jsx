import { useState, useEffect, useMemo, useRef, useCallback } from "react";

// ═══════ DATA ═══════
const D_CL=[
  {id:"C001",name:"María González",phone:"6700-1234",email:"maria@email.com",address:"Costa del Este, Torre Bahía, 12B",nextMaint:"2026-04-10",freq:"trimestral",notes:"Prefiere AM"},
  {id:"C002",name:"Carlos Rodríguez",phone:"6700-5678",email:"carlos@email.com",address:"Punta Pacífica, PH Ocean Park, 8A",nextMaint:"2026-04-15",freq:"mensual",notes:"Llamar antes"},
  {id:"C003",name:"Ana Martínez",phone:"6700-9012",email:"ana@email.com",address:"San Francisco, Calle 74, Casa 12",nextMaint:"2026-04-08",freq:"bimestral",notes:""},
  {id:"C004",name:"Roberto Chen",phone:"6700-3456",email:"roberto@email.com",address:"El Cangrejo, Edif. Plaza, 5C",nextMaint:"2026-05-01",freq:"trimestral",notes:"3 unidades"},
  {id:"C005",name:"Lucía Pérez",phone:"6700-7890",email:"lucia@email.com",address:"Clayton, Res. Albrook, Casa 45",nextMaint:"2026-04-05",freq:"cuatrimestral",notes:"Equipo con fuga"},
];
const D_EQ=[
  {id:"E001",cid:"C001",brand:"Carrier",model:"42KQC012",type:"Split",btu:"12,000",ref:"R-410A",serial:"CAR-2024-001",loc:"Sala",cond:"Bueno"},
  {id:"E002",cid:"C001",brand:"Daikin",model:"FTXS35K",type:"Inverter",btu:"18,000",ref:"R-32",serial:"DAI-2023-102",loc:"Hab. principal",cond:"Excelente"},
  {id:"E003",cid:"C002",brand:"LG",model:"S4-Q12JA3QG",type:"Split Inverter",btu:"12,000",ref:"R-410A",serial:"LG-2024-055",loc:"Oficina",cond:"Bueno"},
  {id:"E004",cid:"C003",brand:"Samsung",model:"AR12TVHQKWK",type:"Split",btu:"12,000",ref:"R-410A",serial:"SAM-2022-033",loc:"Sala",cond:"Regular"},
  {id:"E005",cid:"C004",brand:"Carrier",model:"42KQC024",type:"Split",btu:"24,000",ref:"R-410A",serial:"CAR-2023-088",loc:"Sala principal",cond:"Bueno"},
  {id:"E006",cid:"C004",brand:"Carrier",model:"42KQC012",type:"Split",btu:"12,000",ref:"R-410A",serial:"CAR-2023-089",loc:"Habitación 1",cond:"Bueno"},
  {id:"E007",cid:"C004",brand:"York",model:"?"  ,type:"Mini Split",btu:"9,000",ref:"R-410A",serial:"YRK-2024-015",loc:"Habitación 2",cond:"Bueno"},
  {id:"E008",cid:"C005",brand:"Panasonic",model:"CS-PS12TKH",type:"Inverter",btu:"12,000",ref:"R-32",serial:"PAN-2024-071",loc:"Sala",cond:"Req. reparación"},
];
const D_TK=[
  {id:"T001",name:"Juan Herrera",phone:"6800-1111",spec:"Instalación y mantenimiento",active:true,av:"JH"},
  {id:"T002",name:"Pedro Sánchez",phone:"6800-2222",spec:"Reparación compresores",active:true,av:"PS"},
  {id:"T003",name:"Miguel Torres",phone:"6800-3333",spec:"Sistemas inverter",active:true,av:"MT"},
  {id:"T004",name:"Diego Ruiz",phone:"6800-4444",spec:"Ductos y split",active:true,av:"DR"},
  {id:"T005",name:"Andrés López",phone:"6800-5555",spec:"Refrigerantes y fugas",active:true,av:"AL"},
];
const D_OR=[
  {id:"WO001",cid:"C002",eids:["E003"],tid:"T002",type:"maintenance",status:"in-progress",date:"2026-04-04",pri:"normal",desc:"Mant. semestral",by:"Sistema",data:null,amt:75,photos:[],cb:false,parentId:null},
  {id:"WO002",cid:"C005",eids:["E008"],tid:null,type:"repair",status:"pending",date:"",pri:"high",desc:"Fuga refrigerante",by:"Recepción",data:null,amt:null,photos:[],cb:false,parentId:null},
  {id:"WO003",cid:"C001",eids:["E001","E002"],tid:"T001",type:"maintenance",status:"completed",date:"2026-04-02",pri:"normal",desc:"Mant. trimestral",by:"Sistema",data:{equipData:{"E001":{checks:{filterClean:true,evapClean:true,drainCheck:true},vals:{tIn:"26",tOut:"14",pHigh:"250",amp:"5.2"},obs:"Buen estado"},"E002":{checks:{filterClean:true,condenserClean:true},vals:{tIn:"25",tOut:"13"},obs:"Excelente"}},parts:"2 filtros",genObs:"Todo OK"},amt:140,photos:[],cb:false,parentId:null},
  {id:"WO004",cid:"C004",eids:["E005","E006","E007"],tid:"T002",type:"maintenance",status:"completed",date:"2026-03-18",pri:"normal",desc:"Mant. trimestral",by:"Sistema",data:{equipData:{"E005":{checks:{filterClean:true},vals:{tIn:"25",tOut:"14"},obs:"OK"},"E006":{checks:{filterClean:true},vals:{},obs:"OK"},"E007":{checks:{filterClean:true},vals:{},obs:"Filtro sucio"}},parts:"3 filtros",genObs:""},amt:195,photos:[],cb:false,parentId:null},
  {id:"WO005",cid:"C003",eids:["E004"],tid:"T001",type:"repair",status:"completed",date:"2026-03-15",pri:"high",desc:"No enciende",by:"Recepción",data:{equipData:{"E004":{checks:{capCheck:true,connCheck:true},vals:{amp:"6.1"},obs:"Capacitor dañado, reemplazado"}},parts:"1 capacitor 35/5 MFD",genObs:"Capacitor reemplazado"},amt:120,photos:[],cb:false,parentId:null},
  {id:"WO006",cid:"C001",eids:["E002"],tid:"T003",type:"repair",status:"completed",date:"2026-03-10",pri:"high",desc:"No enfría",by:"Recepción",data:{equipData:{"E002":{checks:{gasLvl:true,leakDet:true},vals:{pHigh:"180",pLow:"45"},obs:"Recarga refrigerante R-32"}},parts:"1.5 lb R-32",genObs:""},amt:150,photos:[],cb:false,parentId:null},
  {id:"WO007",cid:"C005",eids:["E008"],tid:"T004",type:"repair",status:"completed",date:"2026-02-28",pri:"high",desc:"Fuga tubería",by:"Recepción",data:{equipData:{"E008":{checks:{leakDet:true},vals:{pHigh:"200"},obs:"Soldadura cobre"}},parts:"Soldadura plata",genObs:""},amt:180,photos:[],cb:true,parentId:null},
  {id:"WO008",cid:"C002",eids:["E003"],tid:"T005",type:"repair",status:"completed",date:"2026-02-20",pri:"normal",desc:"Ruido exterior",by:"Recepción",data:{equipData:{"E003":{checks:{fanCheck:true},vals:{},obs:"Tornillos sueltos"}},parts:"",genObs:""},amt:90,photos:[],cb:true,parentId:null},
  {id:"WO009",cid:"C003",eids:["E004"],tid:"T002",type:"repair",status:"completed",date:"2026-03-25",pri:"high",desc:"Se apaga solo",by:"Recepción",data:{equipData:{"E004":{checks:{connCheck:true,capCheck:true},vals:{amp:"5.8"},obs:"Problema eléctrico"}},parts:"",genObs:""},amt:110,photos:[],cb:true,parentId:null},
  {id:"WO010",cid:"C005",eids:["E008"],tid:"T005",type:"repair",status:"completed",date:"2026-03-05",pri:"high",desc:"No enfría",by:"Recepción",data:{equipData:{"E008":{checks:{compCheck:true,gasLvl:true},vals:{pHigh:"160",amp:"8.2"},obs:"Compresor bajo rendimiento"}},parts:"",genObs:""},amt:200,photos:[],cb:true,parentId:null},
];

const CHK=[
  {cat:"Interior",l:"Limpieza filtros",f:"filterClean"},{cat:"Interior",l:"Limpieza evaporador",f:"evapClean"},{cat:"Interior",l:"Verificar drenaje",f:"drainCheck"},{cat:"Interior",l:"Limpieza bandeja",f:"trayClean"},
  {cat:"Exterior",l:"Limpieza condensador",f:"condenserClean"},{cat:"Exterior",l:"Verificar ventilador",f:"fanCheck"},{cat:"Exterior",l:"Revisar compresor",f:"compCheck"},
  {cat:"Eléctrico",l:"Amperaje (A)",f:"amp",inp:1},{cat:"Eléctrico",l:"Voltaje (V)",f:"volt",inp:1},{cat:"Eléctrico",l:"Verificar conexiones",f:"connCheck"},{cat:"Eléctrico",l:"Revisar capacitor",f:"capCheck"},
  {cat:"Refrigeración",l:"Presión alta (PSI)",f:"pHigh",inp:1},{cat:"Refrigeración",l:"Presión baja (PSI)",f:"pLow",inp:1},{cat:"Refrigeración",l:"Nivel de gas",f:"gasLvl"},{cat:"Refrigeración",l:"Detectar fugas",f:"leakDet"},
  {cat:"Temperaturas",l:"Temp. entrada °C",f:"tIn",inp:1},{cat:"Temperaturas",l:"Temp. salida °C",f:"tOut",inp:1},{cat:"Temperaturas",l:"Temp. tiro °C",f:"tBlow",inp:1},
  {cat:"General",l:"Estado general",f:"genState",inp:1},{cat:"General",l:"Consumo eléctrico",f:"elecCons",inp:1},
];
const FREQS=[{v:"mensual",l:"Mensual",d:30},{v:"bimestral",l:"Bimestral",d:60},{v:"trimestral",l:"Trimestral",d:90},{v:"cuatrimestral",l:"Cada 4 meses",d:120}];
const TYPES=[{v:"maintenance",l:"Mantenimiento"},{v:"repair",l:"Reparación"},{v:"return",l:"Regreso (garantía)"}];

// ═══════ ICONS ═══════
const IC={
  dash:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  users:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>,
  box:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  clip:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  wrench:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  chart:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  bell:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  plus:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  check:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  x:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  right:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="9 18 15 12 9 6"/></svg>,
  back:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  edit:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  cam:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  link:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  dl:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  snow:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="2" x2="12" y2="22"/><path d="M20 16l-4-4 4-4"/><path d="M4 8l4 4-4 4"/><path d="M16 4l-4 4-4-4"/><path d="M8 20l4-4 4 4"/></svg>,
  alert:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  dollar:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  file:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>,
  copy:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  send:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  trophy:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  repeat:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
  pause:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>,
  wa:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
};

// ═══════ UTILS ═══════
const fd=d=>{if(!d)return"Sin fecha";return new Date(d+"T12:00:00").toLocaleDateString("es-PA",{day:"2-digit",month:"short",year:"numeric"})};
const dt=d=>{if(!d)return 999;return Math.ceil((new Date(d+"T00:00:00")-new Date(new Date().toISOString().split("T")[0]+"T00:00:00"))/864e5)};
const gid=p=>p+String(Date.now()).slice(-6);
const td=()=>new Date().toISOString().split("T")[0];
const nextMaintDate=(fromDate,freq)=>{const d=new Date((fromDate||td())+"T12:00:00");const days=FREQS.find(f=>f.v===freq)?.d||90;d.setDate(d.getDate()+days);return d.toISOString().split("T")[0]};
const typeLbl=t=>TYPES.find(x=>x.v===t)?.l||t;
const typeClr=t=>t==="repair"?"br":t==="return"?"bo":"bc";

// ═══════ CSS ═══════
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
:root{--bg:#F8FAFC;--card:#FFF;--cardH:#F1F5F9;--inp:#F1F5F9;--side:#FFF;--ac:#0891B2;--acD:#0E7490;--acL:#ECFEFF;--acG:rgba(8,145,178,.1);--gn:#059669;--gnB:rgba(5,150,105,.08);--rd:#DC2626;--rdB:rgba(220,38,38,.08);--yl:#D97706;--ylB:rgba(217,119,6,.08);--bl:#2563EB;--blB:rgba(37,99,235,.08);--pp:#7C3AED;--ppB:rgba(124,58,237,.08);--og:#EA580C;--ogB:rgba(234,88,12,.08);--t1:#0F172A;--t2:#475569;--t3:#94A3B8;--brd:#E2E8F0;--brdL:#CBD5E1;--r:10px;--rs:8px;--rx:6px;--sh:0 1px 3px rgba(0,0,0,.06);--shL:0 4px 16px rgba(0,0,0,.08);--tr:.15s ease}
*{margin:0;padding:0;box-sizing:border-box}html,body,#root{height:100%;font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--t1)}
.app{display:flex;height:100vh;overflow:hidden}
.side{width:240px;min-width:240px;background:var(--side);border-right:1px solid var(--brd);display:flex;flex-direction:column}
.slogo{padding:18px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--brd)}
.sic{width:38px;height:38px;background:linear-gradient(135deg,var(--ac),#06B6D4);border-radius:var(--rs);display:flex;align-items:center;justify-content:center;color:#fff}.sic svg{width:20px;height:20px}
.slogo h1{font-size:19px;font-weight:800;letter-spacing:1.5px;font-family:'JetBrains Mono',monospace;color:var(--ac)}.slogo span{font-size:9px;color:var(--t3);font-weight:500}
.snav{flex:1;padding:8px;display:flex;flex-direction:column;gap:1px;overflow-y:auto}
.ni{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:var(--rs);cursor:pointer;transition:var(--tr);color:var(--t2);font-size:13px;font-weight:500;position:relative}
.ni svg{width:17px;height:17px;flex-shrink:0;opacity:.7}.ni:hover{background:var(--acL);color:var(--acD)}.ni.on{background:var(--acL);color:var(--ac);font-weight:600}
.ni.on svg{opacity:1}.ni.on::before{content:'';position:absolute;left:0;top:6px;bottom:6px;width:3px;background:var(--ac);border-radius:0 3px 3px 0}
.nbg{margin-left:auto;background:var(--rd);color:#fff;font-size:10px;padding:1px 6px;border-radius:8px;font-weight:700}
.ns{padding:18px 12px 5px;font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:1.5px;font-weight:700}
.mn{flex:1;display:flex;flex-direction:column;overflow:hidden}
.top{height:56px;border-bottom:1px solid var(--brd);display:flex;align-items:center;justify-content:space-between;padding:0 20px;background:var(--card)}
.ttl{font-size:16px;font-weight:700}.ta{display:flex;align-items:center;gap:8px}
.nbtn{position:relative;width:34px;height:34px;border-radius:var(--rs);border:1px solid var(--brd);background:var(--card);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t2)}.nbtn:hover{border-color:var(--ac);color:var(--ac)}.nbtn svg{width:16px;height:16px}
.ndot{position:absolute;top:5px;right:5px;width:7px;height:7px;background:var(--rd);border-radius:50%;border:2px solid var(--card)}
.upill{display:flex;align-items:center;gap:5px;padding:4px 10px;border:1px solid var(--brd);border-radius:20px;font-size:11px;color:var(--t2);font-weight:500}
.uav{width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,var(--ac),var(--pp));display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff}
.cnt{flex:1;overflow-y:auto;padding:20px}
.sg{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:20px}
.sc{background:var(--card);border:1px solid var(--brd);border-radius:var(--r);padding:16px;box-shadow:var(--sh);position:relative;overflow:hidden}
.sc::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:var(--r) var(--r) 0 0}
.sc.cy::before{background:var(--ac)}.sc.gn::before{background:var(--gn)}.sc.yl::before{background:var(--yl)}.sc.rd::before{background:var(--rd)}.sc.pp::before{background:var(--pp)}.sc.og::before{background:var(--og)}
.sl{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.7px;font-weight:600;margin-bottom:4px}
.sv{font-size:24px;font-weight:800;font-family:'JetBrains Mono',monospace}.ss{font-size:10px;color:var(--t2);margin-top:3px}
.stit{font-size:14px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:6px}.stit svg{width:16px;height:16px;color:var(--ac)}
.tw{background:var(--card);border:1px solid var(--brd);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh)}
.tw table{width:100%;border-collapse:collapse}.tw th{text-align:left;padding:8px 12px;font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.7px;border-bottom:1px solid var(--brd);background:var(--bg);font-weight:700}
.tw td{padding:8px 12px;font-size:12px;border-bottom:1px solid var(--brd);color:var(--t2)}.tw tr:last-child td{border-bottom:none}.tw tr:hover td{background:var(--cardH)}
.tw .nm{color:var(--t1);font-weight:600;font-size:12px}.tw .sb{color:var(--t3);font-size:10px;margin-top:1px}
.bdg{display:inline-flex;align-items:center;padding:2px 7px;border-radius:5px;font-size:10px;font-weight:600}
.bg{background:var(--gnB);color:var(--gn)}.br{background:var(--rdB);color:var(--rd)}.by{background:var(--ylB);color:var(--yl)}.bb{background:var(--blB);color:var(--bl)}.bp{background:var(--ppB);color:var(--pp)}.bc{background:var(--acG);color:var(--ac)}.bo{background:var(--ogB);color:var(--og)}
.btn{display:inline-flex;align-items:center;gap:5px;padding:7px 12px;border-radius:var(--rs);font-size:12px;font-weight:600;cursor:pointer;transition:var(--tr);border:none;font-family:inherit}
.btn svg{width:13px;height:13px}.bp1{background:var(--ac);color:#fff}.bp1:hover{background:var(--acD)}
.bs{background:var(--card);color:var(--t2);border:1px solid var(--brd)}.bs:hover{border-color:var(--ac);color:var(--ac)}
.bsuc{background:var(--gnB);color:var(--gn);border:1px solid transparent}.bsuc:hover{border-color:var(--gn)}
.bdan{background:var(--rdB);color:var(--rd);border:1px solid transparent}
.bwrn{background:var(--ylB);color:var(--yl);border:1px solid transparent}.bwrn:hover{border-color:var(--yl)}
.bsm{padding:4px 8px;font-size:11px}
.ar{display:flex;align-items:center;gap:6px;margin-bottom:14px;flex-wrap:wrap}
.mo{position:fixed;inset:0;background:rgba(15,23,42,.4);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px);padding:16px}
.md{background:var(--card);border:1px solid var(--brd);border-radius:var(--r);width:100%;max-width:600px;max-height:85vh;overflow-y:auto;box-shadow:var(--shL)}
.mh{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--brd)}.mh h2{font-size:15px;font-weight:700}
.mx{width:28px;height:28px;border-radius:var(--rx);border:1px solid var(--brd);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--t3)}.mx:hover{color:var(--rd);border-color:var(--rd)}.mx svg{width:13px;height:13px}
.mb{padding:18px}.mf{display:flex;align-items:center;justify-content:flex-end;gap:6px;padding:12px 18px;border-top:1px solid var(--brd)}
.fg{display:grid;grid-template-columns:1fr 1fr;gap:12px}.fgr{display:flex;flex-direction:column;gap:3px}.fgr.fu{grid-column:1/-1}
.fl{font-size:10px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.4px}
.fi,.fsel,.fta{background:var(--inp);border:1px solid var(--brd);border-radius:var(--rx);padding:8px 10px;color:var(--t1);font-size:12px;font-family:inherit;outline:none;transition:var(--tr)}
.fi:focus,.fsel:focus,.fta:focus{border-color:var(--ac);box-shadow:0 0 0 3px var(--acG)}.fta{min-height:60px;resize:vertical}.fsel{cursor:pointer}
.dp{background:var(--card);border:1px solid var(--brd);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh)}
.dph{padding:16px 18px;border-bottom:1px solid var(--brd);display:flex;align-items:flex-start;justify-content:space-between}
.dpb{padding:18px}.ds{margin-bottom:16px}.ds h4{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.7px;margin-bottom:8px;font-weight:700}
.dg{display:grid;grid-template-columns:1fr 1fr;gap:8px}.di label{display:block;font-size:9px;color:var(--t3);font-weight:600;text-transform:uppercase;letter-spacing:.3px}.di span{font-size:12px;color:var(--t1);font-weight:500}
.cl{display:flex;flex-direction:column;gap:4px}.clc{font-size:9px;font-weight:700;color:var(--ac);margin-top:10px;margin-bottom:3px;text-transform:uppercase;letter-spacing:.8px}
.cli{display:flex;align-items:center;gap:6px;padding:5px 8px;background:var(--inp);border-radius:var(--rx);cursor:pointer;border:1px solid transparent;font-size:12px}.cli:hover{border-color:var(--brdL)}
.clk{width:18px;height:18px;border:2px solid var(--brdL);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.clk.dn{background:var(--gn);border-color:var(--gn)}.clk svg{width:11px;height:11px;color:#fff}
.cli2{margin-left:auto;width:90px;background:var(--card);border:1px solid var(--brd);border-radius:var(--rx);padding:3px 6px;color:var(--t1);font-size:11px;font-family:inherit;outline:none}.cli2:focus{border-color:var(--ac)}
.pg{display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px}
.pt{position:relative;aspect-ratio:1;border-radius:var(--rs);overflow:hidden;border:1px solid var(--brd)}.pt img{width:100%;height:100%;object-fit:cover}
.pr{position:absolute;top:2px;right:2px;width:20px;height:20px;border-radius:50%;background:rgba(0,0,0,.6);border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px}
.pa{aspect-ratio:1;border:2px dashed var(--brdL);border-radius:var(--rs);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;color:var(--t3);gap:3px;font-size:10px}.pa:hover{border-color:var(--ac);color:var(--ac)}.pa svg{width:20px;height:20px}
.flb{background:var(--acL);border:1px solid rgba(8,145,178,.15);border-radius:var(--rs);padding:12px 14px}
.flu{background:var(--card);border:1px solid var(--brd);border-radius:var(--rx);padding:7px 10px;font-size:11px;color:var(--ac);font-family:'JetBrains Mono',monospace;word-break:break-all;font-weight:500}
.np{position:fixed;top:0;right:0;width:340px;height:100vh;background:var(--card);border-left:1px solid var(--brd);z-index:1001;display:flex;flex-direction:column;box-shadow:var(--shL);transform:translateX(100%);transition:transform .3s ease}
.np.op{transform:translateX(0)}.nph{padding:14px;border-bottom:1px solid var(--brd);display:flex;align-items:center;justify-content:space-between}.nph h3{font-size:14px;font-weight:700}
.nl{flex:1;overflow-y:auto;padding:8px}.nc{padding:10px;border-radius:var(--rs);background:var(--bg);border:1px solid var(--brd);margin-bottom:5px;cursor:pointer}.nc:hover{border-color:var(--ac)}.nc.ur{border-left:3px solid var(--ac)}
.nc .nct{font-size:11px;font-weight:600;color:var(--t1);margin-bottom:2px}.nc .ncd{font-size:10px;color:var(--t2)}.nc .ncm{font-size:9px;color:var(--t3);margin-top:3px}
.eqtab{border:1px solid var(--brd);border-radius:var(--rs);margin-bottom:10px;overflow:hidden}
.eqtab-h{padding:10px 14px;background:var(--bg);border-bottom:1px solid var(--brd);display:flex;align-items:center;justify-content:space-between;cursor:pointer}
.eqtab-h h5{font-size:12px;font-weight:700;color:var(--t1)}.eqtab-b{padding:14px}
@media(max-width:900px){.side{display:none}.fg{grid-template-columns:1fr}.dg{grid-template-columns:1fr}}
@media(max-width:600px){.sg{grid-template-columns:1fr 1fr}.cnt{padding:12px}}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:var(--brdL);border-radius:3px}
@keyframes fi{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}.ai{animation:fi .2s ease forwards}
`;

// ═══════ REUSABLE ═══════
function Modal({open,onClose,title,children,footer,wide}){if(!open)return null;return(<div className="mo" onClick={onClose}><div className="md ai" style={wide?{maxWidth:800}:{}} onClick={e=>e.stopPropagation()}><div className="mh"><h2>{title}</h2><button className="mx" onClick={onClose}>{IC.x}</button></div><div className="mb">{children}</div>{footer&&<div className="mf">{footer}</div>}</div></div>)}
function Photos({photos,onChange}){const ref=useRef(null);const add=e=>{Array.from(e.target.files).forEach(f=>{const r=new FileReader();r.onload=ev=>onChange(p=>[...p,{id:gid("P"),src:ev.target.result}]);r.readAsDataURL(f)});e.target.value=""};return(<div><div className="pg">{photos.map(p=>(<div key={p.id} className="pt"><img src={p.src} alt=""/><button className="pr" onClick={()=>onChange(pr=>pr.filter(x=>x.id!==p.id))}>×</button></div>))}<div className="pa" onClick={()=>ref.current?.click()}>{IC.cam}<span>Foto</span></div></div><input ref={ref} type="file" accept="image/*" multiple capture="environment" style={{display:"none"}} onChange={add}/></div>)}

// ═══════ COMPACT PDF GENERATOR ═══════
function genPDF(order,client,eqList,tech,svcData){
  const ed=svcData?.equipData||{};
  const eqSections=eqList.map(e=>{const d=ed[e.id]||{};const checks=Object.entries(d.checks||{}).filter(([,v])=>v).map(([k])=>{const c=CHK.find(x=>x.f===k);return c?.l||k});const vals=Object.entries(d.vals||{}).filter(([,v])=>v).map(([k,v])=>{const c=CHK.find(x=>x.f===k);return`<span class="rv"><b>${c?.l||k}:</b> ${v}</span>`});return`<div class="eq"><div class="eqh"><b>${e.brand} ${e.model}</b> <span class="eqt">${e.btu} BTU · ${e.ref} · ${e.loc}</span></div><div class="eqb">${checks.length?`<div class="chks">${checks.map(c=>`<span class="ck">✓ ${c}</span>`).join("")}</div>`:""}<div class="rv-wrap">${vals.join("")}</div>${d.obs?`<div class="eqo"><b>Obs:</b> ${d.obs}</div>`:""}</div></div>`}).join("");
  const photoHTML=(svcData?.photos||[]).slice(0,6).map(p=>`<img src="${p.src}">`).join("");
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>CLIPSA ${order?.id}</title><style>
body{font-family:Helvetica,sans-serif;color:#0f172a;max-width:680px;margin:0 auto;padding:20px;font-size:11px;line-height:1.4}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #0891B2}
.hdr h1{color:#0891B2;font-size:20px;margin:0}.hdr .meta{text-align:right;font-size:10px;color:#64748b}
h3{font-size:10px;color:#0891B2;text-transform:uppercase;letter-spacing:.8px;margin:12px 0 6px;padding-bottom:3px;border-bottom:1px solid #e2e8f0}
.info{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:3px 12px;font-size:10px}.info .lb{color:#94a3b8}.info .vl{font-weight:600}
.eq{border:1px solid #e2e8f0;border-radius:6px;margin-bottom:6px;overflow:hidden;page-break-inside:avoid}
.eqh{background:#f1f5f9;padding:5px 8px;font-size:11px;display:flex;justify-content:space-between;align-items:center}.eqt{font-size:9px;color:#64748b}
.eqb{padding:6px 8px}.chks{display:flex;flex-wrap:wrap;gap:2px 8px;margin-bottom:3px}.ck{font-size:10px;color:#059669}
.rv-wrap{display:flex;flex-wrap:wrap;gap:2px 12px}.rv{font-size:10px;color:#475569}.rv b{color:#0f172a}
.eqo{font-size:10px;color:#475569;margin-top:3px;padding-top:3px;border-top:1px solid #f1f5f9}
.photos{display:grid;grid-template-columns:repeat(6,1fr);gap:4px;margin:6px 0}.photos img{width:100%;border-radius:4px;border:1px solid #e2e8f0}
.ft{margin-top:14px;padding-top:8px;border-top:2px solid #e2e8f0;text-align:center;font-size:9px;color:#94a3b8}
@media print{body{padding:10px;font-size:10px}}
</style></head><body>
<div class="hdr"><div><h1>CLIPSA</h1><span style="font-size:10px;color:#94a3b8">Informe de Servicio</span></div><div class="meta"><div><b>Orden:</b> ${order?.id}</div><div><b>Fecha:</b> ${new Date().toLocaleDateString("es-PA")}</div><div><b>Tipo:</b> ${typeLbl(order?.type)}</div></div></div>
<h3>Cliente</h3><div class="info"><div><span class="lb">Nombre</span><br><span class="vl">${client?.name||""}</span></div><div><span class="lb">Tel</span><br><span class="vl">${client?.phone||""}</span></div><div><span class="lb">Dir</span><br><span class="vl">${client?.address||""}</span></div><div><span class="lb">Email</span><br><span class="vl">${client?.email||""}</span></div></div>
<h3>Equipos Servidos (${eqList.length})</h3>${eqSections}
${svcData?.parts?`<h3>Repuestos</h3><p style="font-size:10px">${svcData.parts}</p>`:""}
${svcData?.genObs?`<h3>Observaciones Generales</h3><p style="font-size:10px">${svcData.genObs}</p>`:""}
${photoHTML?`<h3>Fotos</h3><div class="photos">${photoHTML}</div>`:""}
<h3>Técnico</h3><div class="info"><div><span class="lb">Nombre</span><br><span class="vl">${tech?.name||""}</span></div><div><span class="lb">Especialidad</span><br><span class="vl">${tech?.spec||""}</span></div></div>
<div class="ft">CLIPSA — Aires Acondicionados — Panamá — 300-CLIPSA</div>
</body></html>`;
  const blob=new Blob([html],{type:"text/html"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`CLIPSA_${order?.id||"informe"}.html`;a.click();URL.revokeObjectURL(url);
}

// ═══════ TECHNICIAN FORM (per-equipment checklist) ═══════
function TechForm({order,client,eqList,tech,onClose,onPending}){
  const[equipData,setEquipData]=useState(()=>{const d={};eqList.forEach(e=>{d[e.id]={checks:{},vals:{},obs:""}});return d});
  const[photos,setPhotos]=useState([]);const[parts,setParts]=useState("");const[genObs,setGenObs]=useState("");
  const[openEq,setOpenEq]=useState(eqList[0]?.id||null);
  const grp=CHK.reduce((a,c)=>{(a[c.cat]=a[c.cat]||[]).push(c);return a},{});
  const toggleChk=(eid,f)=>setEquipData(p=>({...p,[eid]:{...p[eid],checks:{...p[eid].checks,[f]:!p[eid].checks[f]}}}));
  const setVal=(eid,f,v)=>setEquipData(p=>({...p,[eid]:{...p[eid],vals:{...p[eid].vals,[f]:v}}}));
  const setEqObs=(eid,v)=>setEquipData(p=>({...p,[eid]:{...p[eid],obs:v}}));
  const svcData={equipData,photos,parts,genObs,completedAt:new Date().toISOString()};

  return(
    <div className="ai" style={{maxWidth:720,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:16,paddingBottom:12,borderBottom:"2px solid var(--brd)"}}>
        <h1 style={{fontSize:20,fontWeight:800,color:"var(--ac)",fontFamily:"'JetBrains Mono',monospace"}}>CLIPSA</h1>
        <p style={{color:"var(--t3)",fontSize:12}}>Formulario de Servicio — {order?.id}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <div className="sc cy"><div className="sl">Cliente</div><div style={{fontSize:14,fontWeight:700}}>{client?.name}</div><div className="ss">{client?.address}</div></div>
        <div className="sc pp"><div className="sl">Orden</div><div style={{fontSize:14,fontWeight:700}}>{order?.id}</div><div className="ss">{typeLbl(order?.type)} · {fd(order?.date)}</div></div>
      </div>

      {/* Per-equipment checklist */}
      <div className="stit">{IC.box} Checklist por Equipo ({eqList.length})</div>
      {eqList.map(eq=>(
        <div key={eq.id} className="eqtab">
          <div className="eqtab-h" onClick={()=>setOpenEq(openEq===eq.id?null:eq.id)}>
            <h5>{eq.brand} {eq.model} — {eq.loc}</h5>
            <span className="bdg bc">{eq.btu} BTU</span>
          </div>
          {openEq===eq.id&&<div className="eqtab-b">
            <div className="cl">{Object.entries(grp).map(([cat,items])=>(<div key={cat}><div className="clc">{cat}</div>{items.map(c=>(<div key={c.f} className="cli" onClick={()=>toggleChk(eq.id,c.f)}><div className={`clk ${equipData[eq.id]?.checks[c.f]?"dn":""}`}>{equipData[eq.id]?.checks[c.f]&&IC.check}</div><span style={{flex:1}}>{c.l}</span>{c.inp&&<input className="cli2" placeholder="Valor" value={equipData[eq.id]?.vals[c.f]||""} onClick={e=>e.stopPropagation()} onChange={e=>{e.stopPropagation();setVal(eq.id,c.f,e.target.value)}}/>}</div>))}</div>))}</div>
            <div className="fgr" style={{marginTop:10}}><label className="fl">Observaciones de este equipo</label><textarea className="fta" style={{minHeight:40}} value={equipData[eq.id]?.obs||""} onChange={e=>setEqObs(eq.id,e.target.value)} placeholder="Estado, problemas encontrados..."/></div>
          </div>}
        </div>
      ))}

      {/* Photos */}
      <div className="dp" style={{marginTop:14,marginBottom:10}}><div style={{padding:"10px 14px",borderBottom:"1px solid var(--brd)"}}><div className="stit" style={{margin:0,fontSize:12}}>{IC.cam} Fotos</div></div><div style={{padding:14}}><Photos photos={photos} onChange={setPhotos}/></div></div>

      {/* General */}
      <div className="dp" style={{marginBottom:14}}><div style={{padding:14}}>
        <div className="fgr" style={{marginBottom:10}}><label className="fl">Repuestos / Materiales</label><textarea className="fta" style={{minHeight:40}} value={parts} onChange={e=>setParts(e.target.value)} placeholder="Ej: 1 filtro, 1 lb R-410A..."/></div>
        <div className="fgr"><label className="fl">Observaciones generales</label><textarea className="fta" style={{minHeight:40}} value={genObs} onChange={e=>setGenObs(e.target.value)} placeholder="Recomendaciones al cliente..."/></div>
      </div></div>

      {/* Action buttons */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <button className="btn bsuc" style={{flex:1}} onClick={()=>onClose(svcData,"completed")}>{IC.check} Cerrar Orden y Generar PDF</button>
        <button className="btn bwrn" style={{flex:1}} onClick={()=>onPending(svcData)}>{IC.pause} Pendiente — Crear Suborden</button>
      </div>
      <p style={{fontSize:10,color:"var(--t3)",marginTop:6,textAlign:"center"}}>Si no se pudo completar el servicio, usa "Pendiente" para que administración programe la continuación.</p>
    </div>
  );
}

// ═══════ MODAL FORMS ═══════
function ClientForm({data,isNew,onSave,onClose}){
  const[f,setF]=useState(isNew?{name:"",phone:"",email:"",address:"",nextMaint:"",freq:"trimestral",notes:""}:{...data});
  return(<Modal open onClose={onClose} title={isNew?"Nuevo Cliente":"Editar Cliente"} footer={<><button className="btn bs" onClick={onClose}>Cancelar</button><button className="btn bp1" onClick={()=>onSave(f,isNew)}>{IC.check} {isNew?"Crear":"Guardar"}</button></>}>
    <div className="fg">
      <div className="fgr"><label className="fl">Nombre</label><input className="fi" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))}/></div>
      <div className="fgr"><label className="fl">Teléfono</label><input className="fi" value={f.phone} onChange={e=>setF(p=>({...p,phone:e.target.value}))}/></div>
      <div className="fgr"><label className="fl">Email</label><input className="fi" value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))}/></div>
      <div className="fgr"><label className="fl">Frecuencia Mantenimiento</label><select className="fsel" value={f.freq} onChange={e=>setF(p=>({...p,freq:e.target.value}))}>{FREQS.map(fr=><option key={fr.v} value={fr.v}>{fr.l}</option>)}</select></div>
      <div className="fgr"><label className="fl">Próx. Mantenimiento</label><input type="date" className="fi" value={f.nextMaint} onChange={e=>setF(p=>({...p,nextMaint:e.target.value}))}/></div>
      <div className="fgr"><label className="fl">Notas</label><input className="fi" value={f.notes} onChange={e=>setF(p=>({...p,notes:e.target.value}))}/></div>
      <div className="fgr fu"><label className="fl">Dirección</label><input className="fi" value={f.address} onChange={e=>setF(p=>({...p,address:e.target.value}))}/></div>
    </div>
  </Modal>);
}

function EquipForm({data,isNew,clients,onSave,onDelete,onClose}){
  const[f,setF]=useState(isNew?{cid:data?.cid||"",brand:"",model:"",type:"Split",btu:"",ref:"R-410A",serial:"",loc:"",cond:"Bueno"}:{...data});
  return(<Modal open onClose={onClose} title={isNew?"Nuevo Equipo":"Editar Equipo"} footer={<>{!isNew&&<button className="btn bdan bsm" onClick={()=>{onDelete(f.id);onClose()}}>{IC.trash}</button>}<div style={{flex:1}}/><button className="btn bs" onClick={onClose}>Cancelar</button><button className="btn bp1" onClick={()=>onSave(f,isNew)}>{IC.check} {isNew?"Crear":"Guardar"}</button></>}>
    <div className="fg">
      <div className="fgr"><label className="fl">Cliente</label><select className="fsel" value={f.cid} onChange={e=>setF(p=>({...p,cid:e.target.value}))}><option value="">Seleccionar...</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      <div className="fgr"><label className="fl">Marca</label><input className="fi" value={f.brand} onChange={e=>setF(p=>({...p,brand:e.target.value}))}/></div>
      <div className="fgr"><label className="fl">Modelo</label><input className="fi" value={f.model} onChange={e=>setF(p=>({...p,model:e.target.value}))}/></div>
      <div className="fgr"><label className="fl">Tipo</label><select className="fsel" value={f.type} onChange={e=>setF(p=>({...p,type:e.target.value}))}><option>Split</option><option>Inverter</option><option>Split Inverter</option><option>Mini Split</option><option>Cassette</option><option>Piso Techo</option><option>Ducto</option></select></div>
      <div className="fgr"><label className="fl">BTU</label><input className="fi" value={f.btu} onChange={e=>setF(p=>({...p,btu:e.target.value}))}/></div>
      <div className="fgr"><label className="fl">Refrigerante</label><select className="fsel" value={f.ref} onChange={e=>setF(p=>({...p,ref:e.target.value}))}><option>R-410A</option><option>R-32</option><option>R-22</option><option>R-407C</option></select></div>
      <div className="fgr"><label className="fl">Serial</label><input className="fi" value={f.serial} onChange={e=>setF(p=>({...p,serial:e.target.value}))}/></div>
      <div className="fgr"><label className="fl">Ubicación</label><input className="fi" value={f.loc} onChange={e=>setF(p=>({...p,loc:e.target.value}))}/></div>
      <div className="fgr"><label className="fl">Condición</label><select className="fsel" value={f.cond} onChange={e=>setF(p=>({...p,cond:e.target.value}))}><option>Excelente</option><option>Bueno</option><option>Regular</option><option>Req. reparación</option></select></div>
    </div>
  </Modal>);
}

function TechFormModal({data,isNew,onSave,onClose}){
  const[f,setF]=useState(isNew?{name:"",phone:"",spec:""}:{...data});
  return(<Modal open onClose={onClose} title={isNew?"Agregar Técnico":"Editar Técnico"} footer={<><button className="btn bs" onClick={onClose}>Cancelar</button><button className="btn bp1" onClick={()=>onSave(f,isNew)}>{IC.check} {isNew?"Agregar":"Guardar"}</button></>}>
    <div className="fg"><div className="fgr fu"><label className="fl">Nombre</label><input className="fi" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))}/></div><div className="fgr"><label className="fl">Teléfono</label><input className="fi" value={f.phone} onChange={e=>setF(p=>({...p,phone:e.target.value}))}/></div><div className="fgr"><label className="fl">Especialidad</label><input className="fi" value={f.spec} onChange={e=>setF(p=>({...p,spec:e.target.value}))}/></div></div>
  </Modal>);
}

function OrderForm({data,clients,equip,techs,onCreate,onClose}){
  const[f,setF]=useState({cid:data?.cid||"",type:"maintenance",eids:[],allEq:false,tid:"",pri:"normal",desc:"",date:"",charge:true});
  const ce=equip.filter(e=>e.cid===f.cid);
  const togEq=id=>setF(p=>({...p,eids:p.eids.includes(id)?p.eids.filter(x=>x!==id):[...p.eids,id],allEq:false}));
  const togAll=()=>setF(p=>({...p,allEq:!p.allEq,eids:!p.allEq?ce.map(e=>e.id):[]}));
  return(<Modal open onClose={onClose} title="Nueva Orden" footer={<><button className="btn bs" onClick={onClose}>Cancelar</button><button className="btn bp1" onClick={()=>{if(!f.cid||!f.eids.length)return window.alert("Selecciona cliente y equipos");onCreate(f)}}>{IC.check} Crear</button></>}>
    <div className="fg">
      <div className="fgr"><label className="fl">Cliente</label><select className="fsel" value={f.cid} onChange={e=>setF(p=>({...p,cid:e.target.value,eids:[],allEq:false}))}><option value="">Seleccionar...</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      <div className="fgr"><label className="fl">Tipo de Servicio</label><select className="fsel" value={f.type} onChange={e=>setF(p=>({...p,type:e.target.value}))}>{TYPES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select></div>
      {f.type==="return"&&<div className="fgr fu" style={{background:"var(--ylB)",padding:8,borderRadius:"var(--rx)"}}><label className="fl" style={{color:"var(--yl)"}}>¿Se cobra este regreso?</label><select className="fsel" value={f.charge?"si":"no"} onChange={e=>setF(p=>({...p,charge:e.target.value==="si"}))}><option value="no">No (garantía)</option><option value="si">Sí (se cobra)</option></select></div>}
      {f.cid&&<div className="fgr fu"><label className="fl">Equipos</label>
        {(f.type==="maintenance")&&ce.length>0&&<div style={{marginBottom:6}}><label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12,fontWeight:600,color:"var(--ac)"}}><input type="checkbox" checked={f.allEq} onChange={togAll} style={{accentColor:"var(--ac)"}}/>TODOS ({ce.length})</label></div>}
        <div style={{display:"flex",flexDirection:"column",gap:3}}>{ce.map(e=>(<label key={e.id} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 8px",background:f.eids.includes(e.id)?"var(--acL)":"var(--inp)",borderRadius:"var(--rx)",cursor:"pointer",fontSize:11,border:`1px solid ${f.eids.includes(e.id)?"rgba(8,145,178,.3)":"var(--brd)"}`}}><input type="checkbox" checked={f.eids.includes(e.id)} onChange={()=>togEq(e.id)} style={{accentColor:"var(--ac)"}}/><b>{e.brand} {e.model}</b><span style={{color:"var(--t3)"}}>— {e.loc}</span></label>))}</div>
      </div>}
      <div className="fgr"><label className="fl">Prioridad</label><select className="fsel" value={f.pri} onChange={e=>setF(p=>({...p,pri:e.target.value}))}><option value="normal">Normal</option><option value="high">Alta</option></select></div>
      <div className="fgr"><label className="fl">Técnico</label><select className="fsel" value={f.tid} onChange={e=>setF(p=>({...p,tid:e.target.value}))}><option value="">Sin asignar</option>{techs.filter(t=>t.active).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
      <div className="fgr"><label className="fl">Fecha (opcional)</label><input type="date" className="fi" value={f.date} onChange={e=>setF(p=>({...p,date:e.target.value}))}/></div>
      <div className="fgr"><label className="fl">Descripción</label><textarea className="fta" value={f.desc} onChange={e=>setF(p=>({...p,desc:e.target.value}))}/></div>
    </div>
  </Modal>);
}

function OrderEditForm({data,techs,onSave,onClose}){
  const[f,setF]=useState({...data});
  return(<Modal open onClose={onClose} title="Editar Orden" footer={<><button className="btn bs" onClick={onClose}>Cancelar</button><button className="btn bp1" onClick={()=>onSave(f)}>{IC.check} Guardar</button></>}>
    <div className="fg">
      <div className="fgr"><label className="fl">Fecha</label><input type="date" className="fi" value={f.date||""} onChange={e=>setF(p=>({...p,date:e.target.value}))}/></div>
      <div className="fgr"><label className="fl">Prioridad</label><select className="fsel" value={f.pri} onChange={e=>setF(p=>({...p,pri:e.target.value}))}><option value="normal">Normal</option><option value="high">Alta</option></select></div>
      <div className="fgr"><label className="fl">Técnico</label><select className="fsel" value={f.tid||""} onChange={e=>setF(p=>({...p,tid:e.target.value}))}><option value="">Sin asignar</option>{techs.filter(t=>t.active).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
      <div className="fgr"><label className="fl">Estado</label><select className="fsel" value={f.status} onChange={e=>setF(p=>({...p,status:e.target.value}))}><option value="pending">Pendiente</option><option value="in-progress">En progreso</option></select></div>
      <div className="fgr fu"><label className="fl">Descripción</label><textarea className="fta" value={f.desc||""} onChange={e=>setF(p=>({...p,desc:e.target.value}))}/></div>
    </div>
  </Modal>);
}

// ═══════ ANALYTICS ═══════
function Analytics({techs,orders}){
  const stats=useMemo(()=>techs.filter(t=>t.active).map(t=>{const wo=orders.filter(o=>o.tid===t.id&&o.status==="completed");const jobs=wo.length,rev=wo.reduce((s,o)=>s+(o.amt||0),0);const cb=wo.filter(o=>o.cb).length,cbr=jobs>0?cb/jobs*100:0,avg=jobs>0?rev/jobs:0;return{...t,jobs,rev,cb,cbr,avg}}).sort((a,b)=>b.rev-a.rev),[techs,orders]);
  const mxR=Math.max(...stats.map(s=>s.rev),1);const col=["var(--ac)","var(--gn)","var(--pp)","var(--bl)","var(--og)"];
  return(<div className="ai">
    <div className="sg">{[{l:"Facturado",v:"$"+stats.reduce((s,t)=>s+t.rev,0).toLocaleString(),c:"cy"},{l:"Top Técnico",v:stats[0]?.name||"—",c:"gn"},{l:"Más Callbacks",v:[...stats].sort((a,b)=>b.cbr-a.cbr)[0]?.name||"—",c:"rd"},{l:"$/Servicio",v:"$"+(stats.reduce((s,t)=>s+t.rev,0)/(stats.reduce((s,t)=>s+t.jobs,0)||1)).toFixed(0),c:"pp"}].map((s,i)=>(<div key={i} className={`sc ${s.c}`}><div className="sl">{s.l}</div><div className="sv" style={{fontSize:s.v.length>10?16:22}}>{s.v}</div></div>))}</div>
    <div className="dp" style={{marginBottom:14}}><div style={{padding:"10px 14px",borderBottom:"1px solid var(--brd)"}}><div className="stit" style={{margin:0}}>{IC.dollar} Utilidad</div></div><div style={{padding:14}}>{stats.map((s,i)=>(<div key={s.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><div style={{width:100,fontSize:11,fontWeight:600}}>{s.name}</div><div style={{flex:1,height:20,background:"var(--inp)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${(s.rev/mxR)*100}%`,background:col[i%5],borderRadius:4}}/></div><div style={{width:50,textAlign:"right",fontSize:11,fontWeight:700}}>${s.rev}</div></div>))}</div></div>
    <div className="dp"><div style={{padding:"10px 14px",borderBottom:"1px solid var(--brd)"}}><div className="stit" style={{margin:0}}>{IC.repeat} Callbacks</div></div><div className="tw" style={{border:"none",boxShadow:"none"}}><table><thead><tr><th>Técnico</th><th>Serv.</th><th>CB</th><th>Tasa</th><th>$/S</th><th>Rating</th></tr></thead><tbody>
      {[...stats].sort((a,b)=>a.cbr-b.cbr).map(s=>{const r=s.cbr===0?"Excelente":s.cbr<=15?"Bueno":s.cbr<=30?"Regular":"Atención";const rc=s.cbr===0?"bg":s.cbr<=15?"bc":s.cbr<=30?"by":"br";return(<tr key={s.id}><td className="nm">{s.name}</td><td>{s.jobs}</td><td style={{color:s.cb>0?"var(--rd)":"var(--gn)",fontWeight:700}}>{s.cb}</td><td>{s.cbr.toFixed(0)}%</td><td>${s.avg.toFixed(0)}</td><td><span className={`bdg ${rc}`}>{r}</span></td></tr>)})}
    </tbody></table></div></div>
  </div>);
}

// ═══════ MAIN APP ═══════
export default function App(){
  const[pg,setPg]=useState("dashboard");
  const[cl,setCl]=useState(D_CL);const[eq,setEq]=useState(D_EQ);const[tk,setTk]=useState(D_TK);const[or,setOr]=useState(D_OR);
  const[sel,setSel]=useState(null);const[modal,setModal]=useState(null);const[showNot,setShowNot]=useState(false);
  const[techForm,setTechForm]=useState(null);

  // Storage
  const ld=useRef(false);const[rdy,setRdy]=useState(false);
  useEffect(()=>{if(ld.current)return;ld.current=true;try{const r=localStorage.getItem("clipsa4");if(r){const d=JSON.parse(r);if(d.cl?.length)setCl(d.cl);if(d.eq?.length)setEq(d.eq);if(d.tk?.length)setTk(d.tk);if(d.or?.length)setOr(d.or)}}catch(e){}setRdy(true)},[]);
  const sr=useRef(null);
  useEffect(()=>{if(!rdy)return;clearTimeout(sr.current);sr.current=setTimeout(()=>{try{localStorage.setItem("clipsa4",JSON.stringify({cl,eq,tk,or}))}catch(e){}},500)},[cl,eq,tk,or,rdy]);

  // Hash routing for tech form
  useEffect(()=>{if(!rdy)return;const h=window.location.hash;if(h.startsWith("#form-"))setTechForm(h.replace("#form-",""))},[rdy]);
  useEffect(()=>{const handler=()=>{const h=window.location.hash;if(h.startsWith("#form-"))setTechForm(h.replace("#form-",""))};window.addEventListener("hashchange",handler);return()=>window.removeEventListener("hashchange",handler)},[]);

  const nav=useCallback((p,t,id)=>{setSel(t&&id?{t,id}:null);setPg(p);setTechForm(null);window.location.hash=""},[]);

  // Notifications with WhatsApp text
  const notifs=useMemo(()=>{const n=[];
    cl.forEach(c=>{const d=dt(c.nextMaint);if(d<=7&&d>=0){
      const waText=encodeURIComponent(`Estimado/a ${c.name}, le informamos que su mantenimiento de aires acondicionados está programado para el ${fd(c.nextMaint)}. Por favor confirme su disponibilidad. Gracias, CLIPSA.`);
      n.push({title:`Mant.: ${c.name}`,desc:`${fd(c.nextMaint)} (${d} días)`,time:d<=1?"HOY/MAÑANA":"Esta semana",unread:true,urgent:d<=1,waLink:`https://wa.me/${c.phone?.replace(/[^0-9]/g,"")}?text=${waText}`,act:()=>nav("clients","client",c.id)});
    }});
    or.filter(o=>o.status==="pending"&&!o.tid).forEach(o=>{const c=cl.find(x=>x.id===o.cid);n.push({title:`Sin técnico: ${o.id}`,desc:c?.name,time:"Pendiente",unread:true,act:()=>nav("orders","order",o.id)})});
    return n;
  },[cl,or,nav]);

  // CRUD
  const saveCl=(c,isNew)=>{if(isNew)setCl(p=>[...p,{...c,id:gid("C")}]);else setCl(p=>p.map(x=>x.id===c.id?c:x));setModal(null)};
  const saveEq=(e,isNew)=>{if(isNew)setEq(p=>[...p,{...e,id:gid("E")}]);else setEq(p=>p.map(x=>x.id===e.id?e:x));setModal(null)};
  const delEq=id=>setEq(p=>p.filter(x=>x.id!==id));
  const saveTk=(t,isNew)=>{if(isNew)setTk(p=>[...p,{...t,id:gid("T"),active:true,av:t.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}]);else setTk(p=>p.map(x=>x.id===t.id?t:x));setModal(null)};
  const togTk=id=>setTk(p=>p.map(t=>t.id===id?{...t,active:!t.active}:t));

  const createOrder=f=>{const id=gid("WO");setOr(p=>[...p,{...f,id,status:f.tid?"in-progress":"pending",by:"Recepción",data:null,amt:null,photos:[],cb:false,parentId:null}]);setModal({type:"orderCreated",data:{id}})};
  const editOrder=u=>{setOr(p=>p.map(o=>o.id===u.id?{...o,...u,status:u.tid&&u.status==="pending"?"in-progress":u.status}:o));setModal(null)};
  const assignTk=(oid,tid)=>setOr(p=>p.map(o=>o.id===oid?{...o,tid,status:"in-progress"}:o));
  const getTechLink=oid=>`${window.location.origin}${window.location.pathname}#form-${oid}`;
  const copyLink=oid=>{const l=getTechLink(oid);const ta=document.createElement("textarea");ta.value=l;ta.style.cssText="position:fixed;left:-9999px";document.body.appendChild(ta);ta.select();try{document.execCommand("copy");window.alert("Link copiado: "+l)}catch(e){window.prompt("Copia este link:",l)}document.body.removeChild(ta)};
  const openWA=(url)=>{const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";document.body.appendChild(a);a.click();document.body.removeChild(a)};

  // Close order from tech form
  const closeOrder=(orderId,svcData,status)=>{
    const o=or.find(x=>x.id===orderId);
    setOr(p=>p.map(x=>x.id===orderId?{...x,status,data:svcData,photos:svcData.photos}:x));
    if(status==="completed"&&o?.type==="maintenance"){
      const c=cl.find(x=>x.id===o.cid);
      if(c)setCl(p=>p.map(x=>x.id===c.id?{...x,nextMaint:nextMaintDate(td(),c.freq)}:x));
    }
    if(status==="completed"){
      const client=cl.find(x=>x.id===o?.cid);const eqList=eq.filter(e=>(o?.eids||[]).includes(e.id));const tech=tk.find(x=>x.id===o?.tid);
      genPDF(o,client,eqList,tech,svcData);
    }
    setTechForm(null);window.location.hash="";
  };
  const createSubOrder=(orderId,svcData)=>{
    const o=or.find(x=>x.id===orderId);
    setOr(p=>p.map(x=>x.id===orderId?{...x,status:"completed",data:svcData,photos:svcData.photos}:x));
    const subId=gid("WO");
    setOr(p=>[...p,{id:subId,cid:o.cid,eids:o.eids,tid:null,type:o.type,status:"pending",date:"",pri:o.pri,desc:`Continuación de ${o.id}: ${svcData.genObs||"Pendiente"}`,by:"Sistema",data:null,amt:null,photos:[],cb:false,parentId:o.id}]);
    setTechForm(null);window.location.hash="";
    setModal({type:"subOrderCreated",data:{parentId:orderId,subId}});
  };

  // ═══ TECH FORM VIEW ═══
  if(techForm){
    const o=or.find(x=>x.id===techForm);
    if(!o){setTechForm(null);return null}
    const client=cl.find(c=>c.id===o.cid);const eqList=eq.filter(e=>(o.eids||[]).includes(e.id));const tech=tk.find(t=>t.id===o.tid);
    return(<div className="app"><style>{CSS}</style><div className="mn"><div className="top"><span className="ttl">Servicio — {o.id}</span><div className="ta"><div className="upill"><div className="uav">{tech?.av||"?"}</div>{tech?.name||"Técnico"}</div></div></div><div className="cnt"><TechForm order={o} client={client} eqList={eqList} tech={tech} onClose={(sd)=>closeOrder(techForm,sd,"completed")} onPending={(sd)=>createSubOrder(techForm,sd)}/></div></div></div>);
  }

  // ═══ PAGES ═══
  const Dash=()=>{const up=cl.filter(c=>dt(c.nextMaint)>=0&&dt(c.nextMaint)<=7);const comp=or.filter(o=>o.status==="completed");return(<div className="ai">
    <div className="sg">
      <div className="sc cy"><div className="sl">Clientes</div><div className="sv">{cl.length}</div></div>
      <div className="sc yl"><div className="sl">Mant. 7d</div><div className="sv">{up.length}</div></div>
      <div className="sc rd"><div className="sl">Urgentes</div><div className="sv">{or.filter(o=>o.status==="pending"&&o.pri==="high").length}</div></div>
      <div className="sc gn"><div className="sl">Técnicos</div><div className="sv">{tk.filter(t=>t.active).length}</div></div>
      <div className="sc pp"><div className="sl">Completadas</div><div className="sv">{comp.length}</div></div>
      <div className="sc og"><div className="sl">Facturado</div><div className="sv" style={{fontSize:18}}>${comp.reduce((s,o)=>s+(o.amt||0),0).toLocaleString()}</div></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div><div className="stit">{IC.alert} Próximos Mantenimientos</div><div className="tw"><table><thead><tr><th>Cliente</th><th>Fecha</th><th>Días</th><th></th></tr></thead><tbody>{up.sort((a,b)=>dt(a.nextMaint)-dt(b.nextMaint)).map(c=>(<tr key={c.id}><td className="nm">{c.name}</td><td>{fd(c.nextMaint)}</td><td><span className={`bdg ${dt(c.nextMaint)<=2?"br":"by"}`}>{dt(c.nextMaint)}d</span></td><td><button className="btn bsm bp1" onClick={()=>{const msg=encodeURIComponent(`Estimado/a ${c.name}, le recordamos que su mantenimiento de aires acondicionados está programado para el ${fd(c.nextMaint)}. Por favor confirme su disponibilidad. CLIPSA.`);openWA(`https://wa.me/${c.phone?.replace(/[^0-9]/g,"")}?text=${msg}`}}>{IC.wa}</button></td></tr>))}</tbody></table></div></div>
      <div><div className="stit">{IC.clip} Órdenes Activas</div><div className="tw"><table><thead><tr><th>Orden</th><th>Tipo</th><th>Estado</th></tr></thead><tbody>{or.filter(o=>o.status!=="completed").map(o=>{const c=cl.find(x=>x.id===o.cid);return(<tr key={o.id} style={{cursor:"pointer"}} onClick={()=>nav("orders","order",o.id)}><td><span className="nm">{o.id}</span><div className="sb">{c?.name}</div></td><td><span className={`bdg ${typeClr(o.type)}`}>{typeLbl(o.type)}</span></td><td><span className={`bdg ${o.status==="pending"?"by":"bb"}`}>{o.status==="pending"?"Pend.":"Progr."}</span></td></tr>)})}</tbody></table></div></div>
    </div>
  </div>)};

  // Clients list
  const ClList=()=>{const[s,setS]=useState("");const f=cl.filter(c=>(c.name+c.address).toLowerCase().includes(s.toLowerCase()));return(<div className="ai"><div className="ar"><input className="fi" placeholder="Buscar cliente..." value={s} onChange={e=>setS(e.target.value)} style={{flex:1,maxWidth:300}}/><button className="btn bp1" onClick={()=>setModal({type:"cl",isNew:true})}>{IC.plus} Cliente</button></div>
    <div className="tw"><table><thead><tr><th>Cliente</th><th>Equipos</th><th>Frecuencia</th><th>Próx. Mant.</th><th>Estado</th><th></th></tr></thead><tbody>{f.map(c=>{const n=eq.filter(e=>e.cid===c.id).length;const d=dt(c.nextMaint);return(<tr key={c.id} style={{cursor:"pointer"}} onClick={()=>setSel({t:"client",id:c.id})}><td><span className="nm">{c.name}</span><div className="sb">{c.phone}</div></td><td><span className="bdg bc">{n}</span></td><td style={{fontSize:11}}>{FREQS.find(f=>f.v===c.freq)?.l||c.freq}</td><td>{fd(c.nextMaint)}</td><td>{d<=0?<span className="bdg br">Vencido</span>:d<=3?<span className="bdg by">Próximo</span>:<span className="bdg bg">Al día</span>}</td><td>{IC.right}</td></tr>)})}</tbody></table></div></div>)};

  // Client detail
  const ClDet=()=>{const c=cl.find(x=>x.id===sel?.id);if(!c)return null;const ce=eq.filter(e=>e.cid===c.id);const co=or.filter(o=>o.cid===c.id);return(<div className="ai">
    <div className="ar"><button className="btn bs" onClick={()=>setSel(null)}>{IC.back} Volver</button><button className="btn bs bsm" onClick={()=>setModal({type:"cl",data:c,isNew:false})}>{IC.edit}</button></div>
    <div className="dp"><div className="dph"><div><h2 style={{fontSize:18,fontWeight:700}}>{c.name}</h2><div style={{color:"var(--t2)",fontSize:12}}>{c.address}</div></div><div style={{display:"flex",gap:4}}><button className="btn bp1 bsm" onClick={()=>setModal({type:"or",data:{cid:c.id}})}>{IC.plus} Orden</button><button className="btn bs bsm" onClick={()=>setModal({type:"eq",data:{cid:c.id},isNew:true})}>{IC.plus} Equipo</button></div></div>
    <div className="dpb">
      <div className="ds"><h4>Contacto</h4><div className="dg"><div className="di"><label>Tel</label><span>{c.phone}</span></div><div className="di"><label>Email</label><span>{c.email}</span></div><div className="di"><label>Frecuencia</label><span>{FREQS.find(f=>f.v===c.freq)?.l}</span></div><div className="di"><label>Próx. Mant.</label><span>{fd(c.nextMaint)}</span></div></div></div>
      <div className="ds"><h4>Equipos ({ce.length})</h4>{ce.length?<div className="tw"><table><thead><tr><th>Equipo</th><th>Ubic.</th><th>BTU</th><th>Cond.</th><th></th></tr></thead><tbody>{ce.map(e=>(<tr key={e.id}><td><span className="nm">{e.brand} {e.model}</span><div className="sb">{e.type} · {e.serial}</div></td><td>{e.loc}</td><td>{e.btu}</td><td><span className={`bdg ${e.cond==="Excelente"?"bg":e.cond==="Bueno"?"bc":"by"}`}>{e.cond}</span></td><td><button className="btn bs bsm" onClick={ev=>{ev.stopPropagation();setModal({type:"eq",data:e,isNew:false})}} style={{padding:3}}>{IC.edit}</button></td></tr>))}</tbody></table></div>:<p style={{color:"var(--t3)",fontSize:12}}>Sin equipos</p>}</div>
      <div className="ds"><h4>Historial ({co.length})</h4>{co.length?<div className="tw"><table><thead><tr><th>Orden</th><th>Tipo</th><th>Fecha</th><th>Estado</th><th></th></tr></thead><tbody>{co.map(o=>(<tr key={o.id} style={{cursor:"pointer"}} onClick={()=>nav("orders","order",o.id)}><td className="nm">{o.id}{o.parentId&&<span className="bdg bo" style={{marginLeft:4}}>Sub</span>}</td><td><span className={`bdg ${typeClr(o.type)}`}>{typeLbl(o.type)}</span></td><td>{fd(o.date)}</td><td><span className={`bdg ${o.status==="completed"?"bg":o.status==="pending"?"by":"bb"}`}>{o.status==="completed"?"OK":"Pend."}</span></td><td>{o.status==="completed"&&o.data&&<button className="btn bsm bs" onClick={ev=>{ev.stopPropagation();const eqL=eq.filter(x=>(o.eids||[]).includes(x.id));genPDF(o,c,eqL,tk.find(t=>t.id===o.tid),o.data)}}>{IC.dl}</button>}</td></tr>))}</tbody></table></div>:<p style={{color:"var(--t3)",fontSize:12}}>Sin historial</p>}</div>
    </div></div></div>)};

  // Orders list
  const OrList=()=>{const[f,setF]=useState("all");const fl=or.filter(o=>f==="all"||o.status===f);return(<div className="ai"><div className="ar"><div style={{display:"flex",gap:3}}>{[["all","Todas"],["pending","Pend."],["in-progress","Progr."],["completed","Compl."],["cancelled","Cancel."]].map(([v,l])=>(<button key={v} className={`btn bsm ${f===v?"bp1":"bs"}`} onClick={()=>setF(v)}>{l}</button>))}</div><button className="btn bp1" style={{marginLeft:"auto"}} onClick={()=>setModal({type:"or",data:{}})}>{IC.plus} Orden</button></div>
    <div className="tw"><table><thead><tr><th>Orden</th><th>Cliente</th><th>Tipo</th><th>Técnico</th><th>Estado</th><th></th></tr></thead><tbody>{fl.map(o=>{const c=cl.find(x=>x.id===o.cid);const t=tk.find(x=>x.id===o.tid);return(<tr key={o.id} style={{cursor:"pointer"}} onClick={()=>setSel({t:"order",id:o.id})}><td><span className="nm">{o.id}</span><div className="sb">{fd(o.date)}{o.parentId&&" · Sub"}</div></td><td>{c?.name}</td><td><span className={`bdg ${typeClr(o.type)}`}>{typeLbl(o.type)}</span></td><td>{t?.name||<span style={{color:"var(--yl)"}}>—</span>}</td><td><span className={`bdg ${o.status==="completed"?"bg":o.status==="pending"?"by":"bb"}`}>{o.status==="completed"?"OK":o.status==="pending"?"Pend.":"Progr."}</span></td><td>{IC.right}</td></tr>)})}</tbody></table></div></div>)};

  // Order detail
  const OrDet=()=>{const o=or.find(x=>x.id===sel?.id);if(!o)return null;const c=cl.find(x=>x.id===o.cid);const eqL=eq.filter(e=>(o.eids||[]).includes(e.id));const t=tk.find(x=>x.id===o.tid);const av=tk.filter(x=>x.active);const subs=or.filter(x=>x.parentId===o.id);
    return(<div className="ai">
      <div className="ar"><button className="btn bs" onClick={()=>setSel(null)}>{IC.back}</button>{o.status!=="completed"&&o.status!=="cancelled"&&<><button className="btn bs bsm" onClick={()=>setModal({type:"editOr",data:o})}>{IC.edit} Editar</button><button className="btn bdan bsm" onClick={()=>{if(window.confirm("¿Cancelar la orden "+o.id+"?")){setOr(p=>p.map(x=>x.id===o.id?{...x,status:"cancelled"}:x));setSel(null)}}}>{IC.x} Cancelar Orden</button></>}</div>
      <div className="dp"><div className="dph"><div><h2 style={{fontSize:16,fontWeight:700}}>{o.id} — {typeLbl(o.type)}</h2><div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}><span className={`bdg ${o.status==="completed"?"bg":o.status==="pending"?"by":o.status==="cancelled"?"br":"bb"}`}>{o.status==="completed"?"Completada":o.status==="pending"?"Pendiente":o.status==="cancelled"?"Cancelada":"En progreso"}</span><span className={`bdg ${o.pri==="high"?"br":"by"}`}>{o.pri==="high"?"Alta":"Normal"}</span>{o.date?<span className="bdg bc">{fd(o.date)}</span>:<span className="bdg bo">Sin fecha</span>}{o.parentId&&<span className="bdg bp">Sub de {o.parentId}</span>}</div></div>
        <div style={{display:"flex",gap:4}}>{o.status!=="completed"&&o.status!=="cancelled"&&<button className="btn bsuc bsm" onClick={()=>setTechForm(o.id)}>{IC.edit} Servicio</button>}{o.status==="completed"&&o.data&&<button className="btn bp1 bsm" onClick={()=>genPDF(o,c,eqL,t,o.data)}>{IC.dl} PDF</button>}{o.status==="cancelled"&&<span className="bdg br">Orden Cancelada</span>}</div>
      </div>
      <div className="dpb">
        <div className="ds"><h4>Info</h4><div className="dg"><div className="di"><label>Cliente</label><span>{c?.name}</span></div><div className="di"><label>Dirección</label><span>{c?.address}</span></div><div className="di"><label>Equipos</label><span>{eqL.map(e=>`${e.brand} ${e.model}`).join(", ")}</span></div><div className="di"><label>Descripción</label><span>{o.desc}</span></div></div></div>
        <div className="ds"><h4>Técnico</h4>{t?<div style={{display:"flex",alignItems:"center",gap:8,padding:8,background:"var(--bg)",borderRadius:"var(--rx)"}}><div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,var(--ac),var(--pp))",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,color:"#fff"}}>{t.av}</div><div><div style={{fontWeight:600,fontSize:12}}>{t.name}</div><div style={{fontSize:10,color:"var(--t3)"}}>{t.spec}</div></div></div>:<div><p style={{color:"var(--yl)",fontSize:12,marginBottom:6}}>Sin técnico</p><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{av.map(x=><button key={x.id} className="btn bs bsm" onClick={()=>assignTk(o.id,x.id)}>{x.name}</button>)}</div></div>}</div>
        {o.status!=="completed"&&<div className="ds"><h4>Formulario del Técnico</h4><div className="flb" style={{display:"flex",flexDirection:"column",gap:8}}>
          <div className="flu">{getTechLink(o.id)}</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><button className="btn bp1 bsm" onClick={()=>copyLink(o.id)}>{IC.copy} Copiar</button><button className="btn bs bsm" onClick={()=>setTechForm(o.id)}>{IC.edit} Llenar aquí</button><button className="btn bs bsm" onClick={()=>{const msg=encodeURIComponent(`CLIPSA - Orden ${o.id}\nCliente: ${c?.name}\nTipo: ${typeLbl(o.type)}\n\nAbre este link:\n${getTechLink(o.id)}`);openWA("https://wa.me/?text="+msg)}}>{IC.wa} WhatsApp</button></div>
        </div></div>}
        {subs.length>0&&<div className="ds"><h4>Subórdenes</h4><div className="tw"><table><thead><tr><th>Orden</th><th>Estado</th><th>Fecha</th></tr></thead><tbody>{subs.map(s=>(<tr key={s.id} style={{cursor:"pointer"}} onClick={()=>setSel({t:"order",id:s.id})}><td className="nm">{s.id}</td><td><span className={`bdg ${s.status==="completed"?"bg":"by"}`}>{s.status}</span></td><td>{fd(s.date)}</td></tr>))}</tbody></table></div></div>}
        {o.status==="completed"&&o.data&&<div className="ds"><h4>PDF del Informe</h4><button className="btn bp1" onClick={()=>genPDF(o,c,eqL,t,o.data)}>{IC.dl} Descargar Informe PDF</button></div>}
      </div></div></div>)};

  // Equipment
  const EqList=()=>{const[s,setS]=useState("");const f=eq.filter(e=>`${e.brand}${e.model}${e.serial}${cl.find(c=>c.id===e.cid)?.name||""}`.toLowerCase().includes(s.toLowerCase()));return(<div className="ai"><div className="ar"><input className="fi" placeholder="Buscar..." value={s} onChange={e=>setS(e.target.value)} style={{flex:1,maxWidth:300}}/><button className="btn bp1" onClick={()=>setModal({type:"eq",data:{},isNew:true})}>{IC.plus} Equipo</button></div>
    <div className="tw"><table><thead><tr><th>Equipo</th><th>Cliente</th><th>Ubic.</th><th>BTU</th><th>Ref.</th><th>Cond.</th><th></th></tr></thead><tbody>{f.map(e=>{const c=cl.find(x=>x.id===e.cid);return(<tr key={e.id}><td><span className="nm">{e.brand} {e.model}</span><div className="sb">{e.type} · {e.serial}</div></td><td>{c?.name}</td><td>{e.loc}</td><td>{e.btu}</td><td><span className="bdg bb">{e.ref}</span></td><td><span className={`bdg ${e.cond==="Excelente"?"bg":e.cond==="Bueno"?"bc":"by"}`}>{e.cond}</span></td><td><button className="btn bs bsm" style={{padding:3}} onClick={()=>setModal({type:"eq",data:e,isNew:false})}>{IC.edit}</button></td></tr>)})}</tbody></table></div></div>)};

  // Technicians
  const TkList=()=>(<div className="ai"><div className="ar"><div className="stit" style={{margin:0}}>{IC.wrench} Técnicos</div><button className="btn bp1 bsm" style={{marginLeft:"auto"}} onClick={()=>setModal({type:"tk",isNew:true})}>{IC.plus} Agregar</button></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10}}>{tk.map(t=>{const ao=or.find(o=>o.tid===t.id&&o.status==="in-progress");const cc=or.filter(o=>o.tid===t.id&&o.status==="completed").length;return(<div key={t.id} className="sc" style={{opacity:t.active?1:.5}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,var(--ac),var(--pp))",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,color:"#fff"}}>{t.av}</div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{t.name}</div><div style={{fontSize:10,color:"var(--t3)"}}>{t.spec}</div></div>
      <div style={{display:"flex",gap:3}}><button className="btn bs bsm" style={{padding:3}} onClick={()=>setModal({type:"tk",data:t,isNew:false})}>{IC.edit}</button><button className="btn bsm" style={{padding:3,background:t.active?"var(--rdB)":"var(--gnB)",color:t.active?"var(--rd)":"var(--gn)",border:"none"}} onClick={()=>togTk(t.id)}>{t.active?IC.x:IC.check}</button></div></div>
      <span className={`bdg ${t.active?"bg":"br"}`}>{t.active?"Activo":"Inactivo"}</span>
      {ao&&<div style={{background:"var(--acL)",padding:6,borderRadius:"var(--rx)",fontSize:10,marginTop:6}}>Servicio: {ao.id}</div>}
      <div style={{fontSize:10,color:"var(--t3)",marginTop:4}}>{cc} completados · {t.phone}</div>
    </div>)})}</div></div>);

  const titles={dashboard:"Dashboard",clients:"Clientes",equipment:"Equipos",orders:"Órdenes",technicians:"Técnicos",analytics:"Rendimiento"};
  const navItems=[{k:"dashboard",i:IC.dash,l:"Dashboard"},{k:"clients",i:IC.users,l:"Clientes"},{k:"equipment",i:IC.box,l:"Equipos"},{k:"orders",i:IC.clip,l:"Órdenes",b:or.filter(o=>o.status==="pending").length},{k:"technicians",i:IC.wrench,l:"Técnicos"}];

  const renderPage=()=>{
    if(sel?.t==="client")return <ClDet/>;if(sel?.t==="order")return <OrDet/>;
    switch(pg){case"dashboard":return <Dash/>;case"clients":return <ClList/>;case"equipment":return <EqList/>;case"orders":return <OrList/>;case"technicians":return <TkList/>;case"analytics":return <Analytics techs={tk} orders={or}/>;default:return <Dash/>}
  };

  return(
    <div className="app"><style>{CSS}</style>
      <aside className="side"><div className="slogo"><div className="sic">{IC.snow}</div><div><h1>CLIPSA</h1><span>A/C Management</span></div></div>
        <nav className="snav"><div className="ns">Principal</div>{navItems.map(n=><div key={n.k} className={`ni ${pg===n.k&&!sel?"on":""}`} onClick={()=>nav(n.k)}>{n.i}{n.l}{n.b>0&&<span className="nbg">{n.b}</span>}</div>)}<div className="ns">Análisis</div><div className={`ni ${pg==="analytics"?"on":""}`} onClick={()=>nav("analytics")}>{IC.chart} Rendimiento</div></nav>
      </aside>
      <div className="mn">
        <div className="top"><span className="ttl">{sel?.t==="client"?"Cliente":sel?.t==="order"?"Orden":titles[pg]}</span><div className="ta"><div className="nbtn" onClick={()=>setShowNot(true)}>{IC.bell}{notifs.some(n=>n.unread)&&<div className="ndot"/>}</div><div className="upill"><div className="uav">RC</div>Admin</div></div></div>
        <div className="cnt">{renderPage()}</div>
      </div>

      {/* Notifications */}
      {showNot&&<div style={{position:"fixed",inset:0,zIndex:1000}} onClick={()=>setShowNot(false)}/>}
      <div className={`np ${showNot?"op":""}`}><div className="nph"><h3>Notificaciones</h3><button className="mx" onClick={()=>setShowNot(false)}>{IC.x}</button></div><div className="nl">{notifs.map((n,i)=>(<div key={i} className={`nc ${n.unread?"ur":""}`} onClick={()=>{setShowNot(false);n.act?.()}}><div className="nct">{n.title}</div><div className="ncd">{n.desc}</div><div className="ncm">{n.time}</div>{n.waLink&&<button className="btn bp1 bsm" style={{marginTop:4}} onClick={e=>{e.stopPropagation();openWA(n.waLink)}}>{IC.wa} Avisar al cliente</button>}</div>))}</div></div>

      {/* Modals */}
      {modal?.type==="cl"&&<ClientForm data={modal.data} isNew={modal.isNew} onSave={saveCl} onClose={()=>setModal(null)}/>}
      {modal?.type==="eq"&&<EquipForm data={modal.data} isNew={modal.isNew} clients={cl} onSave={saveEq} onDelete={delEq} onClose={()=>setModal(null)}/>}
      {modal?.type==="tk"&&<TechFormModal data={modal.data} isNew={modal.isNew} onSave={saveTk} onClose={()=>setModal(null)}/>}
      {modal?.type==="or"&&<OrderForm data={modal.data} clients={cl} equip={eq} techs={tk} onCreate={createOrder} onClose={()=>setModal(null)}/>}
      {modal?.type==="editOr"&&<OrderEditForm data={modal.data} techs={tk} onSave={editOrder} onClose={()=>setModal(null)}/>}
      {modal?.type==="orderCreated"&&<Modal open onClose={()=>setModal(null)} title="Orden Creada" footer={<button className="btn bp1" onClick={()=>setModal(null)}>OK</button>}><div style={{textAlign:"center"}}><div style={{fontSize:40,marginBottom:8}}>✓</div><h3 style={{marginBottom:4}}>Orden {modal.data.id} creada</h3><p style={{fontSize:12,color:"var(--t2)"}}>Ve al detalle de la orden para copiar el link del formulario y enviarlo al técnico.</p></div></Modal>}
      {modal?.type==="subOrderCreated"&&<Modal open onClose={()=>setModal(null)} title="Suborden Creada" footer={<button className="btn bp1" onClick={()=>{setModal(null);setSel({t:"order",id:modal.data.subId})}}>{IC.right} Ver suborden</button>}><div style={{textAlign:"center"}}><div style={{fontSize:40,marginBottom:8}}>↩</div><h3 style={{marginBottom:4}}>Suborden {modal.data.subId}</h3><p style={{fontSize:12,color:"var(--t2)"}}>Se creó como continuación de {modal.data.parentId}. Asigna fecha y técnico desde el detalle.</p></div></Modal>}
    </div>
  );
}
