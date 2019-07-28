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

  let info = '';
  let projectId = null;
  let rate = null;
  let startDate = format(new Date(), 'YYYY-MM-DD[T]HH:mm:ssZZ') // '2019-07-27T18:30:04+00:00';
  let endDate = null;

  function handleSubmit () {
    mutate(client, {
      mutation: insert_reg,
      variables: {
        info,
        projectId,
        rate,
        startDate,
        endDate: endDate === '' ? null : endDate
      }
    }).catch(e => {
      console.log(e);
    })
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
          {#each result.data.project as project (project.id)}
            <option value={project.id}>{project.name}</option>
          {:else}
            <option disabled>No projects</option>
          {/each}
          <option value={null}>Geen</option>
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
    </p>
  </div>
  <p>
    <button>Save</button>
  </p>
</form>
