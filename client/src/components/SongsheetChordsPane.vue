<script setup>
import ChordDiagram from "@/components/ChordDiagram.vue";
import InstrumentControl from "@/components/InstrumentControl.vue";
import ChordDiagramReference from "@/components/ChordDiagramReference.vue";
import useSongsheetSettings from "@/stores/songsheet-settings";
import Pane from "@/components/Pane.vue";
import { ref, defineExpose, computed } from "vue";
import { useResponsive } from "@/composables";
import { Chord } from "chordsheetjs";

const props = defineProps({
  chords: {
    type: Array,
    required: true,
  },
  definitions: {
    type: Object,
    default: null
  }
});

const allChords = computed(() => new Set([...props.chords, ...Object.keys(props.definitions || [])]))

defineExpose({
  height: computed(() => chordsModal?.value?.height),
  transition: computed(() => chordsModal?.value?.transition),
});

const settings = useSongsheetSettings();
const sidebar = useResponsive("sm");
const chordsModal = ref();

function onBreakpointDidChange(breakpoint) {
  settings.showChords = breakpoint !== "bottom";
}

function formattedChord(chord) {
  return Chord.parse(chord)?.toString({ useUnicodeModifier: true }) ?? chord;
}
</script>

<template>
  <div :class="{sidebar: sidebar}">
    <!-- Hidden sprite of chord diagrams -->
    <svg hidden xmlns="http://www.w3.org/2000/svg">
      <chord-diagram
        v-for="chord in allChords"
        :key="chord + settings.instrument"
        :chord="chord"
        :definition="definitions[chord]"
        :instrument="settings.instrument"
      />
    </svg>
    <div
      v-if="sidebar"
      class="w-[80px] snap-y snap-mandatory flex flex-col overflow-y-auto px-3 h-full"
    >
      <div
        v-for="chord in allChords"
        :key="`sidebar-${chord}`"
        class="text-center text-sm snap-start pt-4 first:pt-6 last:pb-6"
      >
        <div>{{ formattedChord(chord) }}</div>
        <chord-diagram-reference :chord="chord" />
      </div>
    </div>
    <pane
      v-else
      ref="chordsModal"
      :is-open="true"
      :settings="{
        initialBreak: settings.showChords ? 'middle' : 'bottom',
        breaks: {
          top: { enabled: true, height: 172 },
          middle: { enabled: true, height: 120 },
          bottom: { enabled: true, height: 33 },
        },
      }"
      @breakpoint-did-change="onBreakpointDidChange"
    >
      <div
        class="flex flex-row flex-nowrap overflow-x-auto w-full py-4 snap-x snap-mandatory"
      >
        <div
          v-for="chord in chords"
          :key="`modal-${chord}`"
          class="flex flex-col text-center text-sm pointer-events-none select-none snap-start pl-3 first:pl-6 last:pr-6 first:ms-auto last:me-auto"
        >
          <div class="chord">
            {{ formattedChord(chord) }}
          </div>
          <chord-diagram-reference :chord="chord" />
        </div>
      </div>
      <ion-footer>
        <ion-toolbar>
          <ion-buttons slot="end">
            <instrument-control v-model="settings.instrument" />
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>
    </pane>
  </div>
</template>

<style scoped>
.sidebar {
  @apply left-0 top-0 bottom-0 bg-white dark:bg-black border-r dark:border-slate-800;
  padding-left: env(safe-area-inset-left, 0);
}

.horizontal-scroller > *:first-child {
  @apply ms-auto;
}

.horizontal-scroller > *:last-child {
  @apply me-auto;
}
</style>
