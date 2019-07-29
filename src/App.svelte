<script context="module">
  import gql from 'graphql-tag';
  import { client } from './apollo';
  import { subscribe } from 'svelte-apollo';

  const AUTHOR_LIST = gql`
    subscription {
      project {
        id
        name
        rate
      }
    }
  `;

  const REG_LIST = gql`
    subscription {
      reg(order_by: {startDate: desc}) {
        id
        rate
        info
        startDate
        endDate
        projectId
        project {
          id
          createdDate
          name
          rate
        }
      }
    }
  `;

  const authorsList = subscribe(client, { query: AUTHOR_LIST });
  const regsList = subscribe(client, { query: REG_LIST });
  /*
  regsList.subscribe(
    (ok) => {
      console.log(ok);

      ok.then(
        res => {
          console.log(res);
        }
      ).catch(
        e => console.log(e)
      );
    }
  );
  */
</script>

<script>
  import ProjectForm from './ProjectForm.svelte';
  import RegForm from './RegForm.svelte';
  import RegItem from './RegItem.svelte';
  import Report from './Report.svelte';

  const name = 'Eve + svelte';

  let showProjectForm = false;
  let showRegForm = false;

  let reg = null;
  function showReg(selectedReg = null) {
    if (! showRegForm) { reg = selectedReg; showRegForm = true; }
  }
</script>

<Report />

<button on:click="{() => {showProjectForm = !showProjectForm}}">showProjectForm</button>
{#if showProjectForm}<hr/><ProjectForm/><hr/>{/if}

{#if showRegForm}<hr/><RegForm reg={reg ? {...reg} : null}/><hr/>{/if}

<style>
.layout {
  display: flex;
}

.layout__filters {
  width: 262px;
  background: #eee;
}

.layout__content {
  flex: 1 1;
}
</style>

<section class="layout">
  <div class="layout__filters">
    <ul>
      {#await $authorsList}
        <li>Loading...</li>
      {:then result}
        {#each result.data.project as project (project.id)}
          <li>{project.name} {project.rate}</li>
        {:else}
          <li>No authors found</li>
        {/each}
      {:catch error}
        <li>Error loading authors: {error.message}</li>
      {/await}
    </ul>
  </div>
  <div class="layout__content">
    <button on:click="{() => {showRegForm = !showRegForm; reg = null;}}">showRegForm</button>
    {#await $regsList}
    <p>Loading...</p>
    {:then result}
      {#each result.data.reg as reg (reg.id)}
        <div on:click={() => {showReg(reg)}}>
          <RegItem reg={reg} />
        </div>
      {:else}
        No regs.
      {/each}
    {:catch error}
    <p>Something went wrong...</p>
    {/await}
  </div>
</section>

