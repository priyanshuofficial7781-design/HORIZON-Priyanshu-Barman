import React, { useState } from 'react';
import {
  ArchitectureNode,
  ArchitectureConnection,
  SystemDesignNodeType,
} from '../../types/systemDesign';
import {
  Globe,
  Server,
  Database,
  Layers,
  Cpu,
  Workflow,
  Radio,
  HardDrive,
  Network,
  Share2,
  Info,
} from 'lucide-react';

interface ArchitectureCanvasProps {
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
  onSelectNode?: (node: ArchitectureNode) => void;
}

export const ArchitectureCanvas: React.FC<ArchitectureCanvasProps> = ({
  nodes,
  connections,
  onSelectNode,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const getNodeIcon = (type: SystemDesignNodeType) => {
    switch (type) {
      case 'client':
        return Globe;
      case 'dns':
      case 'cdn':
        return Radio;
      case 'load_balancer':
      case 'api_gateway':
        return Network;
      case 'microservice':
        return Server;
      case 'cache':
        return Cpu;
      case 'message_queue':
        return Workflow;
      case 'sql_database':
      case 'nosql_database':
        return Database;
      case 'blob_storage':
        return HardDrive;
      default:
        return Layers;
    }
  };

  const getNodeColors = (type: SystemDesignNodeType) => {
    switch (type) {
      case 'client':
        return 'from-blue-600 to-cyan-500 border-cyan-500/40 text-cyan-300';
      case 'dns':
      case 'cdn':
        return 'from-amber-600 to-yellow-500 border-yellow-500/40 text-yellow-300';
      case 'load_balancer':
      case 'api_gateway':
        return 'from-purple-600 to-indigo-500 border-purple-500/40 text-purple-300';
      case 'microservice':
        return 'from-emerald-600 to-teal-500 border-emerald-500/40 text-emerald-300';
      case 'cache':
        return 'from-rose-600 to-pink-500 border-rose-500/40 text-rose-300';
      case 'message_queue':
        return 'from-orange-600 to-amber-500 border-orange-500/40 text-orange-300';
      case 'sql_database':
      case 'nosql_database':
        return 'from-indigo-600 to-blue-500 border-indigo-500/40 text-indigo-300';
      case 'blob_storage':
        return 'from-teal-600 to-cyan-500 border-teal-500/40 text-teal-300';
      default:
        return 'from-slate-700 to-slate-800 border-slate-600 text-slate-300';
    }
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="relative w-full h-[520px] bg-[#070b18] border border-slate-800 rounded-2xl overflow-hidden shadow-inner flex flex-col">
      {/* Canvas Grid Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #8B5CFF 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Canvas Top Bar */}
      <div className="relative z-10 flex items-center justify-between px-4 py-2.5 bg-[#0a0f20]/90 backdrop-blur-sm border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">Interactive Architecture Topology</span>
          <span className="text-[10px] text-slate-500 font-mono">
            ({nodes.length} Components, {connections.length} Data Paths)
          </span>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click any component to inspect protocols and scaling properties</span>
        </div>
      </div>

      {/* Interactive Node Layout Area */}
      <div className="relative flex-1 p-6 overflow-auto">
        <div className="relative min-w-[950px] min-h-[420px]">
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {connections.map((conn) => {
              const from = nodes.find((n) => n.id === conn.fromNodeId);
              const to = nodes.find((n) => n.id === conn.toNodeId);
              if (!from || !to) return null;

              const x1 = from.x + 80;
              const y1 = from.y + 40;
              const x2 = to.x + 80;
              const y2 = to.y + 40;
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              return (
                <g key={conn.id}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="url(#lineGrad)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="animate-pulse"
                  />
                  {conn.label && (
                    <text
                      x={midX}
                      y={midY - 8}
                      fill="#94a3b8"
                      fontSize="9"
                      textAnchor="middle"
                      className="font-mono select-none"
                    >
                      {conn.label}
                    </text>
                  )}
                  {conn.protocol && (
                    <text
                      x={midX}
                      y={midY + 12}
                      fill="#38bdf8"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="font-mono select-none"
                    >
                      [{conn.protocol}]
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => {
            const Icon = getNodeIcon(node.type);
            const isSelected = node.id === selectedNodeId;
            const colorClass = getNodeColors(node.type);

            return (
              <div
                key={node.id}
                onClick={() => {
                  setSelectedNodeId(node.id);
                  if (onSelectNode) onSelectNode(node);
                }}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                className={`absolute z-10 w-44 p-3 rounded-xl border transition-all cursor-pointer select-none bg-[#0b1226]/95 backdrop-blur-md shadow-lg ${
                  isSelected
                    ? 'ring-2 ring-cyan-400 border-cyan-400 scale-105 shadow-cyan-500/20'
                    : 'border-slate-800 hover:border-slate-600 hover:scale-[1.02]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${colorClass} text-white`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 truncate">
                    {node.type.replace('_', ' ')}
                  </div>
                </div>

                <div className="font-semibold text-xs text-slate-200 truncate">{node.label}</div>
                {node.technology && (
                  <div className="mt-1 text-[10px] font-mono text-cyan-400 truncate">
                    {node.technology}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Component Inspector Drawer (When a node is selected) */}
      {selectedNode && (
        <div className="relative z-20 p-3.5 bg-[#0a0f20] border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-bottom duration-150">
          <div className="flex items-center gap-3">
            <div className="text-xs font-bold text-cyan-300 font-mono">
              [{selectedNode.label}]
            </div>
            <div className="text-xs text-slate-300 max-w-lg truncate">
              {selectedNode.description}
            </div>
          </div>
          {selectedNode.technology && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-500">Tech Stack:</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {selectedNode.technology}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
