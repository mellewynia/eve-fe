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
  const authorsList = subscribe(client, { query: AUTHOR_LIST });
</script>

<script>
  import ProjectForm from './ProjectForm.svelte';

  const name = 'Eve + svelte';
  let showProjectForm = false;
</script>

<h1>Hello {name}!</h1>

<button on:click="{() => {showProjectForm = !showProjectForm}}">showProjectForm</button>
{#if showProjectForm}<hr/><ProjectForm/><hr/>{/if}

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
