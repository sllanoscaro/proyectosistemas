// render_tree.js

// Datos del árbol
const treeData = {
    name: "Registra historial de morosidad",
    id: "node1",
    children: [
        { name: "Rechazar\\ncrédito", id: "node1r", type: "reject" },
        {
            name: "Cuenta con más\\nde dos años en su\\ntrabajo actual",
            id: "node2",
            children: [
                { name: "Rechazar\\ncrédito", id: "node2r", type: "reject" },
                {
                    name: "Ingresos mensuales son\\n suficientes para la cuota",
                    id: "node3",
                    children: [
                        { name: "Rechazar\\ncrédito", id: "node3r", type: "reject" },
                        { name: "Aceptar\\ncrédito", id: "node4", type: "leaf" }
                    ]
                }
                ]
        }
        ]
};

const width = 764;
const height = 764;

const svg = d3.select("#decisionTree")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(40,50)");

const treeLayout = d3.tree().size([height - 100, width - 200]);
const root = d3.hierarchy(treeData);
treeLayout(root);

// Líneas entre nodos
svg.selectAll(".link")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y));

// Nodos
const node = svg.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", d => `node ${d.data.type || ''}`)
    .attr("id", d => d.data.id)
    .attr("transform", d => `translate(${d.x},${d.y})`);

node.append("circle")
    .attr("r", 40);

node.append("text")
    .attr("text-anchor", "middle")
    .selectAll("tspan")
    .data(d => d.data.name.split('\\n'))  // ← divide el texto donde haya '\\n'
    .enter()
    .append("tspan")
    .attr("x", 0)
    .attr("dy", (d, i) => i === 0 ? "5em" : "1.2em")  // primera línea más abajo, luego normal
    .text(d => d);

svg.selectAll(".link-label")
    .data(root.links())
    .enter()
    .append("text")
    .attr("class", "link-label")
    .attr("x", d => (d.source.x + d.target.x) / 2)
    .attr("y", d => (d.source.y + d.target.y) / 2 + 50) // ligeramente arriba del camino
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "#333")
    .text((d, i) => {
        // Aquí puedes personalizar las etiquetas según la rama
        // O puedes usar un arreglo externo con textos predefinidos
        const labels = [
            "Sí",   // node1 → node2
            "No",   // node1 → node1r
            "No",   // node2 → node3
            "Sí",   // node2 → node2r
            "No",   // node3 → node4
            "Sí",   // node3 → node3r
            "No",   // node4 → node5
            "Sí"    // node4 → node5r
        ];
        return labels[i] || "";
    });

