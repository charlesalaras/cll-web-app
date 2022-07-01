import drawGraph from './roadmap.js';

export default function Test() {
    return (
        <>
        <head>
            <script src="https://d3js.org/d3.v6.min.js"></script>
            <script src="https://unpkg.com/d3-array@1"></script>
            <script src="https://unpkg.com/d3-collection@1"></script>
            <script src="https://unpkg.com/d3-path@1"></script>
            <script src="https://unpkg.com/d3-shape@1"></script>
            <script src="https://unpkg.com/d3-sankey@0"></script>
            <script src="roadmap.js"></script>
        </head>
        <body>
            <div className="container"></div>
            <script>
                {drawGraph(".container")}
            </script>
        </body>
        </>
    )}