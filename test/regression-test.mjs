#!/usr/bin/env node
import { apiGet, apiPost, apiDelete, encId, runTest } from './test-utils.mjs';

const DIR = import.meta.dirname;

await runTest('mindmap', DIR, async (ctx) => {
  let s = ctx.step('Create mindmap diagram');
  let diagramId;
  try {
    const res = await apiPost('/api/mindmap/diagrams', { name: 'Test Mindmap' });
    diagramId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create root node');
  let rootId;
  try {
    const res = await apiPost('/api/mindmap/nodes', { diagramId, name: 'Project', x1: 300, y1: 200, x2: 420, y2: 250 });
    rootId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create child node 1');
  let child1Id;
  try {
    const res = await apiPost('/api/mindmap/nodes', { diagramId, name: 'Frontend', x1: 100, y1: 100, x2: 220, y2: 150 });
    child1Id = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create child node 2');
  let child2Id;
  try {
    const res = await apiPost('/api/mindmap/nodes', { diagramId, name: 'Backend', x1: 100, y1: 300, x2: 220, y2: 350 });
    child2Id = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create edge: Root → Frontend');
  try {
    await apiPost('/api/mindmap/edges', { diagramId, sourceId: rootId, targetId: child1Id });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create edge: Root → Backend');
  try {
    await apiPost('/api/mindmap/edges', { diagramId, sourceId: rootId, targetId: child2Id });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  await ctx.layoutDiagram(diagramId);
  await ctx.exportDiagram(diagramId, 'Export mindmap image');

  s = ctx.step('Delete diagram');
  try {
    await apiDelete(`/api/mindmap/diagrams/${encId(diagramId)}`);
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }
});
