# Focus Sanctuary

Build a completely NEW web application called **StudyScape** from the ground up.

IMPORTANT:

* This is a fresh project.

* Do NOT assume an existing StudyScape codebase.

* Do NOT copy an old application architecture.

* Build a clean, scalable, production-quality architecture.

* The application should be inspired by the concept and requirements below, but implemented as a new product.

* Prioritize visual quality, immersion, performance, and clean component architecture.

# PRODUCT CONCEPT

StudyScape is an immersive productivity and focus application.

The idea is simple:

Instead of staring at a conventional productivity dashboard while studying, the user enters a beautiful virtual environment and spends their focus session inside that world.

The user should feel:

> "I am sitting inside a beautiful room, studying, while the world outside continues around me."

This should feel like a combination of:

* A premium productivity app

* A cozy virtual study environment

* An ambient game

* A cinematic study room

* A focus timer

* A personal digital world

The environment should be the hero.

The UI should support the experience rather than dominate it.

---

# 1. APPLICATION STRUCTURE

Create the following primary areas:

## HOME

The Home page is the main entry point.

Include:

* StudyScape branding

* Welcome/greeting

* Total focus time

* Today's focus time

* Session statistics

* Current/selected world

* Continue Focus button

* Start Focus button

* World preview

* Progress toward world unlocks

* Quick access to recent worlds

* Ambient visual effects

The Home page should feel visually alive.

### BUTTERFLIES

Butterflies should exist ONLY on the Home page.

They should create a subtle magical atmosphere.

Important:

Butterflies must NOT appear inside study environments.

Do not render them inside:

* Japanese room

* Library

* Café

* Bedroom

* Snow cabin

* Observatory

* Any study world

* Any future study world

The ButterflyEffect should only be mounted when the current view is Home.

Conceptually:

```text

Home

  → ButterflyEffect mounted

Study World

  → ButterflyEffect NOT mounted

```

Do not merely hide the butterflies with CSS.

The component should not run at all outside Home.

---

# 2. WORLDS

Create a world-selection system.

Initial worlds should include visually distinct environments such as:

* Japanese Room

* Fantasy Library

* Cozy Café

* Bedroom / Study

* Snow Cabin

* Observatory

* Treehouse

* Blossom / Nature environment

Each world must feel like a genuinely different place.

Every world should have:

* Unique background

* Unique lighting

* Unique architecture

* Unique outdoor/window composition

* Appropriate atmospheric effects

* World-specific room objects

* World-specific configuration

Do not build one generic room and simply change the background.

---

# 3. WORLD CONFIGURATION SYSTEM

Build worlds using a data-driven configuration system.

For example:

```js

{

  id: "japanese-room",

  name: "Japanese Room",

  roomFeatures: {

    fireplace: false,

    candles: true,

    deskLamp: true,

    window: true

  },

  windows: [

    {

      id: "main-window",

      x: "...",

      y: "...",

      width: "...",

      height: "..."

    }

  ],

  supportedWeather: [

    "clear",

    "cloudy",

    "rain",

    "thunderstorm",

    "snow",

    "fog",

    "windy"

  ]

}

```

The exact implementation is up to you.

The important requirement is that every world defines:

* Its available room objects

* Its window/outdoor regions

* Its supported atmosphere

* Its visual characteristics

This must be scalable so new worlds can be added without rewriting the entire application.

---

# 4. FOCUS MODE

Create an immersive Focus Mode.

When the user starts a focus session:

1. Transition from the dashboard into the selected world.

2. Enter the environment.

3. Start the focus timer.

4. Show the user's avatar/character inside the environment.

5. Allow the environment to animate continuously.

6. Keep essential controls available through a minimal HUD.

The environment should occupy most of the screen.

The interface should NOT look like a normal productivity dashboard.

---

# 5. FOCUS TIMER

Create a reliable focus timer.

Support:

* Start

* Pause

* Resume

* End session

* Reset

* Session duration

* Remaining time

* Progress indicator

The timer must remain accurate if the browser tab loses focus.

The timer should integrate elegantly into the environment.

Use a subtle cinematic HUD.

Avoid huge timer typography that covers the scene.

---

# 6. AVATAR / STUDY ANIMATIONS

Place an avatar/character inside the study environment.

During a focus session, the avatar should feel alive.

Create a reusable animation/state system supporting:

* Reading

* Writing

* Typing

* Thinking

* Looking at notes

* Studying

* Solving a difficult problem

* Slightly struggling

* Taking a short break

* Looking around

* Stretching

* Returning to work

* Relaxing/fun idle moments

The avatar should transition between states naturally.

Animations should be:

* Calm

* Natural

* Loopable

* Subtle

* Suitable for long study sessions

Do not make the avatar constantly move.

The experience should feel similar to a game character's AFK/work animations.

Build the architecture so more animations can be added later.

---

# 7. CINEMATIC CAMERA SYSTEM

Create an optional subtle camera system for Focus Mode.

Possible camera views:

* Wide environment

* Medium character shot

* Desk/workspace

* Side angle

* Environmental shot

* Detail/close-up

Transitions should be slow and cinematic.

Do NOT constantly move the camera.

Camera changes should happen occasionally and smoothly.

The goal is to make the world feel alive without distracting the user.

---

# 8. WEATHER SYSTEM

This is one of the MOST IMPORTANT parts of the application.

Weather must feel like it is happening OUTSIDE the room.

Supported weather:

* Clear

* Cloudy

* Rain

* Thunderstorm

* Snow

* Fog

* Windy

## CRITICAL RULE

Weather must NEVER appear over the interior room.

Weather must be visible ONLY through windows or outdoor openings.

For example:

### RAIN

Rain should:

* Exist outside

* Be visible through the window

* Exist behind the glass/window frame

* Follow the perspective of the outdoor environment

Rain must NOT fall over:

* Bed

* Desk

* Floor

* Walls

* Furniture

* Avatar

* Sidebar

* Buttons

* UI

### SNOW

Snow must:

* Exist outside

* Be visible through windows

* Remain behind the window

Snow must NEVER fall inside the room.

### CLOUDY

Clouds and overcast atmosphere should affect only the outdoor sky visible through the windows.

Do NOT place large clouds over the room.

### THUNDERSTORM

Thunderstorm should include:

* Outdoor storm clouds

* Lightning outside

* Occasional lightning flashes

* Subtle room-light response

Lightning should never appear over the UI.

It should feel atmospheric and cinematic.

### FOG

Fog must exist outdoors.

It should:

* Be visible through windows

* Obscure distant outdoor scenery

* Recede naturally

* Stay outside the room

Do not put a fog layer over the entire interior.

### WINDY

Wind should affect outdoor elements.

For example:

* Trees

* Leaves

* Rain direction

* Snow direction

* Outdoor particles

Do NOT create wind particles flying around inside the room.

### CLEAR

No weather particles.

Keep the outdoor environment clean.

---

# 9. WINDOW-MASKED WEATHER ARCHITECTURE

DO NOT implement weather using a generic full-screen overlay.

Instead create a reusable weather rendering system.

The rendering hierarchy should conceptually be:

```text

WORLD BACKGROUND

        ↓

OUTDOOR / SKY CONTENT

        ↓

WEATHER CLIPPED TO WINDOW AREAS

        ↓

WINDOW GLASS / REFLECTIONS / FRAME

        ↓

ROOM INTERIOR

        ↓

AVATAR

        ↓

APP UI

```

Each world must define its own window regions.

Examples:

World A:

* One large central window

World B:

* Multiple windows

World C:

* Side window

World D:

* Unique window shape

Weather must automatically use the currently active world's window mask.

If a world has multiple windows, weather should appear through all relevant windows.

If a world has no outdoor window/opening, do not render outdoor weather over the room.

Use whichever implementation is most appropriate:

* CSS clipping

* Masks

* Canvas

* SVG masks

* Layered containers

* WebGL if genuinely necessary

Prioritize performance.

Avoid hundreds of unnecessary React DOM elements.

---

# 10. WEATHER TRANSITIONS

Switching between weather states should be smooth.

For example:

Clear → Rain

should gradually introduce rain.

Rain → Snow

should transition naturally.

Thunderstorm should have atmospheric transitions rather than abrupt full-screen effects.

---

# 11. PREMIUM ATMOSPHERE PANEL

Create a premium right-side Atmosphere panel.

This should feel like a cinematic environmental control console.

Visual direction:

* Dark cinematic plum/charcoal

* Translucent surfaces

* Subtle glass effect

* Sophisticated gradients

* Soft shadows

* Elegant rounded corners

* Refined borders

* Premium typography

* Restrained glow

* Excellent spacing

* Smooth transitions

Avoid:

* Generic Bootstrap cards

* Bright white cards

* Excessive neon

* Excessive glow

* Thick borders

* Cheap glassmorphism

* Huge controls

* Clutter

The panel should feel integrated with the world.

---

# 12. ATMOSPHERE PANEL STRUCTURE

Header:

**Atmosphere**

Subtitle:

**Shape the light, sky and room**

Add an elegant close button.

## TIME OF DAY

Provide:

* Sunrise

* Morning

* Afternoon

* Golden Hour

* Sunset

* Night

* Midnight

Use premium selectable controls.

## WEATHER

Provide:

* Clear

* Cloudy

* Rain

* Thunderstorm

* Snow

* Fog

* Windy

Active state should be visually obvious but restrained.

Inactive:

* Dark translucent background

* Muted text

* Subtle border

Hover:

* Slightly brighter surface

* Border highlight

Active:

* Accent

* Soft glow

* Slight elevation

---

# 13. ROOM FEATURES

Add a section called:

**IN THE ROOM**

Only show controls that are relevant to the currently selected world.

Possible controls:

* Fireplace

* Candles

* Desk Lamp

* Window

Do NOT show all controls globally.

For example:

Japanese Room:

* Candles

* Desk Lamp

* Window

Cozy Bedroom:

* Fireplace

* Candles

* Desk Lamp

* Window

Modern Café:

* Window

* Appropriate lighting

Outdoor environment:

* No irrelevant interior controls

The world configuration should determine which controls appear.

---

# 14. FIREPLACE

The fireplace must be a REAL interactive atmospheric element.

OFF:

* Fireplace dark

* No fire

* No glow

ON:

* Visible flames

* Warm orange illumination

* Flickering light

* Subtle nearby light falloff

* Natural warmth

The light should affect nearby surfaces.

Do not make it look like a flat GIF pasted onto the scene.

---

# 15. CANDLES

OFF:

* Candle flames disabled

* No active glow

ON:

* Visible flame

* Subtle flicker

* Warm localized illumination

* Natural intensity variation

Multiple candles should create a cohesive warm atmosphere.

Do not create an exaggerated giant glow.

---

# 16. DESK LAMP

OFF:

* Lamp inactive/dark

ON:

* Visible warm light source

* Subtle glow

* Nearby desk receives warmer illumination

* Natural light falloff

Do not use a giant circular glow.

The lamp should look like it actually illuminates the scene.

---

# 17. WINDOW CONTROL

The Window control must be functional.

ON:

* Outdoor environment visible

* Weather visible through the window

* Appropriate illumination

* Reflections/glass effects where suitable

OFF:

* Adjust the corresponding window illumination/atmosphere according to the world

Do NOT simply remove the architectural window if doing so would break the scene.

The behavior should be world-specific.

---

# 18. LIGHTING SYSTEM

Create a reusable lighting system.

Room objects should influence the environment.

For example:

Fireplace ON

→ warm room lighting

Candles ON

→ localized warm lighting

Desk Lamp ON

→ focused desk lighting

Thunderstorm

→ occasional outdoor lightning illumination

Time of day

→ overall environmental lighting changes

The effects should combine naturally.

Do not simply place giant colored overlays on the screen.

---

# 19. TASKS PANEL

Create a premium Tasks sidebar matching the Atmosphere panel.

Preserve the following functionality:

* Add task

* Complete task

* Delete task

* Priority

* Progress

* Completed state

Improve:

* Input

* Add button

* Task cards

* Checkbox

* Priority badge

* Progress indicator

* Hover states

* Typography

* Spacing

The Tasks panel should share the same visual language as Atmosphere.

---

# 20. OTHER PRODUCTIVITY FEATURES

Include:

* Notes

* Reading

* Stats

* Ambience

* Sound controls

* World switching

* Time of day

* Weather controls

* Tasks

These should be integrated into the overall application without making the interface cluttered.

---

# 21. STATS / PROGRESS

Track:

* Total focus time

* Today's focus time

* Number of sessions

* Longest session

* World usage

* Progress toward unlocking worlds

Persist data locally for the first version.

Use localStorage or another lightweight local persistence solution.

Keep the architecture ready for a future backend.

---

# 22. WORLD UNLOCKING

Create a progression system based on focus time.

Example:

Fantasy Library

Unlocked

Snow Cabin

8 / 10 hours

Observatory

18 / 25 hours

The unlock system should feel rewarding but not manipulative.

Show:

* World preview

* Required hours

* Current progress

* Unlock state

---

# 23. DEVELOPER MODE

Create a Developer Mode for testing.

Developer Mode should allow:

* Unlock all worlds

* Enter any world

* Set arbitrary focus time

* Test weather

* Test time of day

* Test room features

* Test avatar animations

* Test camera angles

* Reset progression

* View debug information

Developer Mode must bypass normal unlock requirements.

Keep it separate from the normal user experience.

---

# 24. SOUND / AMBIENCE

Prepare the architecture for world-specific ambient sounds.

Examples:

Japanese Room:

* Wind

* Nature

Library:

* Quiet room ambience

* Fireplace

Café:

* Café ambience

Snow Cabin:

* Wind

* Fireplace

Rain:

* Rain ambience

Include controls for:

* Master volume

* Ambient volume

* Mute

If audio assets are not available, build the architecture and controls cleanly without relying on fake audio.

---

# 25. VISUAL DESIGN SYSTEM

The overall application should feel:

* Cinematic

* Cozy

* Premium

* Calm

* Immersive

* Modern

* Game-inspired

* Minimal

Use:

* Glassmorphism carefully

* Soft gradients

* Elegant typography

* Large rounded surfaces

* Layered depth

* Ambient lighting

* Subtle motion

* Refined micro-interactions

Avoid generic SaaS styling.

The room/world should always remain the visual focus.

---

# 26. RESPONSIVE DESIGN

Support:

* Desktop

* Laptop

* Tablet

* Mobile

Desktop should provide the most immersive experience.

On smaller screens:

* Adapt the sidebar

* Maintain readable timer

* Avoid UI overlap

* Make controls touch-friendly

* Preserve the visual environment

---

# 27. PERFORMANCE

Because this application contains animated environments, weather, particles, lighting and avatar animations:

Prioritize performance.

Use:

* CSS animations when appropriate

* Canvas where appropriate

* Efficient React rendering

* Memoization where useful

* Lazy-loaded worlds

* Proper cleanup

* Limited particle counts

* Visibility-aware animation

Do not run animations that are not visible.

Especially:

* Do not run ButterflyEffect outside Home.

* Do not run weather effects outside their active window.

* Do not run unnecessary world animations when the world is not active.

---

# 28. ACCESSIBILITY

Support:

* Keyboard navigation

* Visible focus states

* Accessible controls

* Sufficient contrast

* Reduced motion

* Screen reader-friendly labels

Create a reduced-motion option that disables unnecessary camera movement and excessive environmental animations.

---

# 29. COMPONENT ARCHITECTURE

Use a clean modular architecture.

Suggested structure:

```text

src/

  components/

    home/

    worlds/

    focus/

    avatar/

    camera/

    weather/

    atmosphere/

    lighting/

    tasks/

    notes/

    stats/

    audio/

    developer/

    ui/

  hooks/

    useFocusTimer

    useWorld

    useWeather

    useAtmosphere

    useLighting

    useProgression

    useAvatar

    useCamera

  data/

    worlds

    weather

    animations

    roomFeatures

  pages/

  lib/

  assets/

```

Do not rigidly follow this structure if a better architecture is appropriate.

The important requirement is modularity and reusability.

---

# 30. IMPORTANT DESIGN PRINCIPLES

Follow these rules throughout development:

### RULE 1

The environment is the hero.

### RULE 2

Weather belongs OUTSIDE the room.

### RULE 3

Room objects must actually affect the environment.

### RULE 4

Butterflies belong ONLY on Home.

### RULE 5

Atmosphere controls should be intelligent and world-specific.

### RULE 6

The UI should feel premium and cinematic.

### RULE 7

Do not use fake functionality.

### RULE 8

Do not use generic placeholder visuals when the feature is intended to be functional.

### RULE 9

Avoid unnecessary full-screen overlays.

### RULE 10

Build reusable systems instead of hardcoding each world.

---

# 31. FINAL QA

Before considering the application complete, test every world.

For every world verify:

* Clear weather works

* Cloudy works

* Rain appears ONLY outside windows

* Thunderstorm stays outside

* Snow stays outside

* Fog stays outside

* Wind affects only the outdoor environment

* Weather never covers the room

* Weather never covers UI

* Correct room controls appear

* Fireplace works where available

* Candles work where available

* Desk lamp works where available

* Window works where available

* Lighting responds correctly

* Time of day works

* Tasks work

* Timer works

* Notes work

* Stats work

* World switching works

* Audio controls work

* Developer mode works

* Butterflies appear ONLY on Home

* No butterflies run inside study worlds

* Responsive layouts work

* No horizontal overflow

* No broken imports

* No console errors

Test transitions between:

```text

HOME

↓

WORLD SELECTION

↓

FOCUS MODE

↓

SESSION COMPLETE

↓

HOME

```

Also test:

```text

Home

→ Study World

→ Weather Change

→ Time Change

→ Room Feature Toggle

→ World Switch

→ Return Home

```

---

# FINAL EXPERIENCE

The final application should not feel like:

> "A productivity dashboard with animated backgrounds."

It should feel like:

> "A beautiful digital world that I enter when I want to focus."

The user should feel like they are physically sitting inside the room.

When it rains, they should feel like they are looking through the window at rain outside.

When the fireplace is enabled, they should feel the room become warmer.

When the desk lamp is enabled, the desk should feel illuminated.

When night arrives, the entire environment should naturally become darker.

When they return Home, the butterflies can return.

Make the experience polished, immersive, cohesive, and production-quality.

Build the application completely rather than stopping at a visual mockup.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/54f36ca1-85c0-4814-b98b-373bdade018c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
