# How it decides

Jev Mistral Reflex provides a small cascade for Mistral agents: Jev selects among declared tools or actions, while uncertain and open-ended requests fall through to a Mistral-compatible responder.

The exact question and criteria live beside the call in [src/index.mjs](../src/index.mjs), making review and version control straightforward. Dates, identifiers, arithmetic, candidate generation, thresholds and state transitions remain code-owned. Synthetic demo probabilities are illustrative. Calibrate review thresholds on representative human labels before operational use.
