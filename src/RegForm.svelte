<script context="module">
  import gql from 'graphql-tag';
  import { client } from './apollo';
  import { subscribe, mutate } from 'svelte-apollo';
  import { format } from 'date-fns';

  const AUTHOR_LIST = gql`
    subscription {
      project {
        id
        name
        rate
      }
    }
  `;

  const projectsList = subscribe(client, { query: AUTHOR_LIST });
</script>

<script>
  export let reg = null;

  const insert_reg = gql`
    mutation (
      $info: String!,
      $projectId: Int, $rate: Int,
      $startDate: timestamptz!, $endDate: timestamptz
    ) {
      insert_reg (objects: {
        info: $info,
        projectId: $projectId, rate: $rate,
        startDate: $startDate, endDate: $endDate
      }) {
        returning {
          id
          info
        }
      }
    }
  `;

  const update_reg = gql`
    mutation (
      $id: Int!,
      $info: String!,
      $projectId: Int, $rate: Int,
      $startDate: timestamptz!, $endDate: timestamptz
    ) {
      update_reg (
        where: {
          id: {_eq: $id}
        },
        _set: {
          info: $info,
          projectId: $projectId, rate: $rate,
          startDate: $startDate, endDate: $endDate
        }
      ) {
        returning {
          id
          info
        }
      }
    }
  `;

  let id = reg ? reg.id : null;
  let info = reg ? reg.info : '';
  let projectId = reg ? reg.projectId : null;
  let rate = reg ? reg.rate : null;
  let startDate = reg ? reg.startDate : format(new Date(), 'YYYY-MM-DD[T]HH:mm:ssZZ') // '2019-07-27T18:30:04+00:00';
  let endDate = reg ? reg.endDate : null;

  function handleSubmit () {
    const variables = {
      info,
      projectId,
      rate,
      startDate,
      endDate: endDate === '' ? null : endDate
    };

    if (id) { variables.id = id; }

    mutate(client, {
      mutation: id ? update_reg : insert_reg, variables
    }).catch(e => {
      console.log(e);
    })
  }

  // Check delete

  let deleteTimeout = null;

  const delete_reg = gql`
    mutation (
      $id: Int!
    ) {
      delete_reg (
        where: {
          id: {_eq: $id}
        }
      ) {
        returning {
          id
        }
      }
    }
  `;

  function handleDelete() {
    deleteTimeout = setTimeout(() => {
      deleteTimeout = null;
    }, 1620)
  }

  function handleDeleteConfirm() {
    mutate(client, {mutation: delete_reg, variables: { id: reg.id }});
    clearTimeout(deleteTimeout); deleteTimeout = null;
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <p>
    <label>Info</label>
    <input 
      type="text" bind:value={info}
    >
  </p>
  <div>
    <p>
      <label>Project</label>
      <select bind:value={projectId}>
        {#await $projectsList}
          <option disabled>Loading...</option>
        {:then result}
          <option value={null} selected={projectId === null}>Geen</option>
          {#each result.data.project as project (project.id)}
            <option value={project.id} selected={projectId === project.id}>{project.name}</option>
          {:else}
            <option disabled>No projects</option>
          {/each}
        {:catch error}
          <option disabled>Error</option>
        {/await}
      </select>
    </p>
    <p>
      <label>Rate</label>
      <input
        type="number" bind:value={rate}
      >
    </p>
  </div>
  <div>
    <p>
      <label>Start</label>
      <input
        type="text" bind:value={startDate}
        placeholder=""
      >
    </p>
    <p>
      <label>End</label>
      <input
        type="text" bind:value={endDate}
      >
      <button type="button" on:click={() => { endDate = format(new Date(), 'YYYY-MM-DD[T]HH:mm:ssZZ'); }}>now</button>
    </p>
  </div>
  <p>
    <button>Save</button>
    <button type="button" on:click={handleDelete} disabled={deleteTimeout !== null}>Delete</button>
    {#if (deleteTimeout !== null)}<button type="button" on:click={handleDeleteConfirm}>Confirm delete</button>{/if}
  </p>
</form>
