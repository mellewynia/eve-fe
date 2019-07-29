<script>
function createReportTemplate () {
  return {
    total: 0,
    totalSum: 0,
    totalTime: 0,
    projs: [],
    noProj: createProjTemplate({
      id: null,
      name: 'No project',
      abbr: 'np'
    })
  };
}

function createProjTemplate (proj) {
  console.log(proj);
  return {
    ...proj,
    totalSum: 0,
    totalTime: 0,
    regs: []
  };
}

import gql from 'graphql-tag';

const REPORT = gql`
  {
    project {
      id
      name
      abbr
    }
    reg {
      id
      startDate
      endDate
      info
      projectId
      rate
    }
  }
`;

import { query } from 'svelte-apollo';
import { client } from './apollo';

let res = null;

function load() {
  query(client, { query: REPORT })
    .subscribe((ok) => {
      ok.then(_res => {
        res = _res;
        console.log(_res);
        create();
      })
    });
}

let report = null;

import { getTime } from 'date-fns';

function create() {
  if (res === null) { return; }

  report = createReportTemplate();
  const projs = res.data.project;
  const regs = res.data.reg;

  console.log(projs);
  projs.forEach(proj => {
    report.projs.push(createProjTemplate(proj)); console.log(proj);
  });

  regs.forEach(reg => {
    let reportProj = report.noProj;
    if (reg.projectId !== null) {
      console.log(reg.projectId, report.projs);
      reportProj = report.projs.find(proj => proj.id === reg.projectId);
    }

    // Add reg to project
    reportProj.regs.push(reg);
    
    // Add reg to totals
    if (reg.startDate && reg.endDate) {
      const ms = getTime(reg.endDate) - getTime(reg.startDate);
      let sum = 0;
      if (reg.rate !== null) {
        sum = Math.round((ms / 3600000) * reg.rate);
      } 
      report.totalTime += ms;
      report.totalSum += sum;
      reportProj.totalTime += ms;
      reportProj.totalSum += sum;
    }
  });

  console.log(report);
}

load();
</script>

{#if (report)}
  <ul>
    {#each report.projs as _proj}
      <li>
        {_proj.name} {_proj.totalTime} €{Math.round(_proj.totalSum / 100).toFixed(2)}
      </li>
    {/each}
    <li>
      {report.noProj.name} 
      {report.noProj.totalTime}
      €{Math.round(report.noProj.totalSum / 100).toFixed(2)}
    </li>
  </ul>
{/if}
