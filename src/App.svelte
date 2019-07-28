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
</script>

<script>
  import ProjectForm from './ProjectForm.svelte';
  import RegForm from './RegForm.svelte';
  import RegItem from './RegItem.svelte';

  const name = 'Eve + svelte';

  let showProjectForm = false;
  let showRegForm = true;
</script>

<h1>Hello {name}!</h1>

<button on:click="{() => {showProjectForm = !showProjectForm}}">showProjectForm</button>
{#if showProjectForm}<hr/><ProjectForm/><hr/>{/if}

<button on:click="{() => {showRegForm = !showRegForm}}">showRegForm</button>
{#if showRegForm}<hr/><RegForm/><hr/>{/if}

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
    {#await $regsList}
    <p>Loading...</p>
    {:then result}
      {#each result.data.reg as reg (reg.id)}
        <RegItem reg={reg} />
      {:else}
        No regs.
      {/each}
    {:catch error}
    <p>Something went wrong...</p>
    {/await}
  </div>
</section>

