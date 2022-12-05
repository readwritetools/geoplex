/* Copyright (c) 2022 Read Write Tools. */
import Icosahedron from'../icosahedron/icosahedron.js';import*as Options from'../util/options.js';import expect from'softlib/expect.js';import terminal from'softlib/terminal.js';import*as Gcsio from'gcsio';import*as IcoGcsBridge from'../gcs/ico-gcs-bridge.js';export function uniplexAll(e,o){expect(e,'String'),Options.validateUniplexOptions(o),Options.buildDeclarations(o);const t=new Icosahedron(o.maxTerrasect);t.regularAll();var n=new Gcsio.GcsHoldingArea;IcoGcsBridge.convertVertices(t.vertices,n.gcsFeaturePoints,o),IcoGcsBridge.convertEdges(t.edges,n.gcsFeatureLines,o),IcoGcsBridge.convertFaces(t.faces,n.gcsFeaturePolygons,o),writeUsingGcsio(n,e,o)}export function uniplexVertices(e,o){expect(e,'String'),Options.validateUniplexOptions(o),Options.buildDeclarations(o);const t=new Icosahedron(o.maxTerrasect).regularVertices();var n=new Gcsio.GcsHoldingArea;return IcoGcsBridge.convertVertices(t,n.gcsFeaturePoints,o),writeUsingGcsio(n,e,o),t}export function uniplexEdges(e,o){expect(e,'String'),Options.validateUniplexOptions(o),Options.buildDeclarations(o);const t=new Icosahedron(o.maxTerrasect).regularEdges();var n=new Gcsio.GcsHoldingArea;return IcoGcsBridge.convertEdges(t,n.gcsFeatureLines,o),writeUsingGcsio(n,e,o),t}export function uniplexFaces(e,o){expect(e,'String'),Options.validateUniplexOptions(o),Options.buildDeclarations(o);const t=new Icosahedron(o.maxTerrasect).regularFaces();var n=new Gcsio.GcsHoldingArea;return IcoGcsBridge.convertFaces(t,n.gcsFeaturePolygons,o),writeUsingGcsio(n,e,o),t}export function uniplexCentroids(e,o){expect(e,'String'),Options.validateUniplexOptions(o),Options.buildDeclarations(o);const t=new Icosahedron(o.maxTerrasect).regularCentroids();var n=new Gcsio.GcsHoldingArea;return IcoGcsBridge.convertCentroids(t,n.gcsFeaturePoints,o),writeUsingGcsio(n,e,o),t}function writeUsingGcsio(e,o,t){['tae','taebin'].includes(t.outputFormat)&&(e.gcsFeaturePoints.length>0||e.gcsFeatureLines.length>0)?terminal.abnormal('tae and taebin output formats are only available for polygons'):['geojson','gfe','ice','tae'].includes(t.outputFormat)?Gcsio.writeTextFile(e,o,t):['gfebin','icebin','taebin'].includes(t.outputFormat)?Gcsio.writeBinaryFile(e,o,t):terminal.abnormal(`unknown output format ${t.outputFormat}`)}export function printVertexTopology(e,o){expect(e,'Map'),expect(o,'Boolean'),console.log('\n---------------'),console.log('vertex topology');for(let t of e.values()){if(console.log(`vertex ${t.formattedID} has ${t.neighboringFaces.length} neighboring faces`),o)for(let e=0;e<t.neighboringFaces.length;e++)console.log(`    F(${t.neighboringFaces[e]})`);if(console.log(`vertex ${t.formattedID} has ${t.neighboringVertices.length} neighboring vertices`),o)for(let e=0;e<t.neighboringVertices.length;e++)console.log(`    V(${t.neighboringVertices[e]})`)}}export function printEdgeTopology(e,o){expect(e,'Map'),expect(o,'Boolean'),console.log('\n-------------'),console.log('edge topology');for(let t of e.values())if(console.log(`edge ${t.formattedID} has ${t.neighboringFaces.length} neighboring faces`),o)for(let e=0;e<t.neighboringFaces.length;e++)console.log(`    F(${t.neighboringFaces[e]})`)}export function printFaceTopology(e,o){console.log('\n-------------'),console.log('face topology');for(let t of e.values()){if(console.log(`face ${t.formattedID} has ${t.neighboringFaces.length} neighboring faces`),o)for(let e=0;e<t.neighboringFaces.length;e++)console.log(`    F(${t.neighboringFaces[e]})`);if(console.log(`face ${t.formattedID} has ${t.neighboringEdges.length} neighboring edges`),o)for(let e=0;e<t.neighboringEdges.length;e++)console.log(`    E(${t.neighboringEdges[e]})`)}}export function printCentroidTopology(e,o){console.log('\n-------------'),console.log('centroid topology');for(let t of e.values())if(console.log(`centroid ${t.formattedID} has ${t.neighboringCentroids.length} neighboring centroids`),o)for(let e=0;e<t.neighboringCentroids.length;e++)console.log(`    C(${t.neighboringCentroids[e]})`)}export function printVertexStatistics(e,o){expect(e,'Map'),expect(o,'Boolean');var t=new Array;for(let n of e.values())n.accumulateVertexStatistics(t,o);for(let e=0;e<t.length;e++)console.log(`Working set: ${t[e]} vertices at terrasect level ${e}`)}export function printEdgeStatistics(e,o){expect(e,'Map'),expect(o,'Boolean');var t=new Array;for(let n of e.values())n.accumulateEdgeStatistics(t,o);for(let e=0;e<t.length;e++){var n=t[e];console.log('\n----------------------------'),console.log(`Working set distribution at terrasect level ${e}:`);var r=0,i=0,s=new Map([...n.entries()].sort());for(let[e,o]of s.entries()){const t=Math.round(e).toLocaleString()+'km';console.log(`${t}: ${o} edges`),r+=o,i+=e*o}console.log(`Count: ${r} edges`);var c=i/r;const o=Math.round(c).toLocaleString()+'km';console.log(`Average length: ${o}`)}}export function printFaceStatistics(e,o){expect(e,'Map'),expect(o,'Boolean');var t=new Array;for(let n of e.values())n.accumulateFaceStatistics(t,o);for(let e=0;e<t.length;e++){var n=t[e];console.log('\n----------------------------'),console.log(`Working set distribution at terrasect level ${e}:`);var r=0,i=0,s=new Map([...n.entries()].sort());for(let[e,o]of s.entries()){const t=Math.round(e).toLocaleString()+'km²';console.log(`${t}: ${o} faces`),r+=o,i+=e*o}const o=Math.round(i).toLocaleString()+'km²';var c=i/r;const l=Math.round(c).toLocaleString()+'km²';console.log(`Count: ${r} faces`),console.log(`Average area: ${l}`),console.log(`Total area: ${o}`)}}export function printCentroidStatistics(e,o){expect(e,'Map'),expect(o,'Boolean');var t=new Array;for(let n of e.values())n.accumulateCentroidStatistics(t,o);for(let e=0;e<t.length;e++){var n=t[e];console.log('\n----------------------------'),console.log(`Working set distribution at terrasect level ${e}:`);var r=0,i=0,s=new Map([...n.entries()].sort());for(let[e,o]of s.entries()){const t=(100*e).toFixed(0)+'%';console.log(`${t}: ${o} centroids`),r+=o,i+=e*o}const o=(100*(i/r)).toFixed(0)+'%';console.log(`Count: ${r} centroids`),console.log(`Average bias: ${o}`)}}