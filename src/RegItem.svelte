<script>
export let reg;

import { format, distanceInWordsStrict, distanceInWordsToNow, getTime } from 'date-fns';

</script>

<style>
.item {
	position: relative;
	padding: 0.84rem 0 0.84rem 1.26rem;
	transition: 262ms ease-out;
  cursor: pointer;
}

.item:hover { background: #F0F6FE;  transition: none; }
.item:focus { background: #F0F6FE; }
.item:active, .item.___isEditing { background: #eaf3ff; }
</style>

<article
  tabindex="0"
  class="item"
  class:___isEditing={false}
>
  <style>
    .meta {
      margin: 0;
      color: #ababab;
      font-size: 1.2rem;
      line-height: 1;
      overflow: hidden;
      white-space: no-wrap;
      text-overflow: ellipsis;
      letter-spacing: -0.035rem;
      padding: 0 0 0.2rem 0;
    }
  </style>
  <p class="meta">
    <span class="time-item-meta__from-to-time">
      {format(reg.startDate, 'HH:mm')}-{#if (reg.endDate)}{format(reg.endDate, 'HH:mm')}
        <strong>
          {distanceInWordsStrict(reg.startDate, reg.endDate)}
        </strong>
      {:else}<span class="recording-circle"></span> <span class="recording">{distanceInWordsToNow(reg.startDate)}</span>
        <style>
          .recording-circle {
            display: inline-block;
            background: red;
            width: 0.6rem;
            height: 0.6rem;
            border-radius: 0.5rem;
          }

          .recording {
            color: red;
          }
        </style>
      {/if}
    </span>
    {#if reg.rate !== null && reg.rate > 0}
      <span class:recording={!reg.endDate}>
        €{( /*cool*/ (((getTime(reg.endDate || new Date()) - getTime(reg.startDate)) / 3600000) * reg.rate ) / 100).toFixed(2)}
      </span>
    {/if}
    <span class="time-item-meta__project-name">
      {reg.project ? reg.project.name : '-'}
    </span>
  </p>
  <style>
    .info {
      margin: 0;
      font-size: 1.4rem;
    }
  </style>
  <p class="info">{reg.info}</p>
</article>
