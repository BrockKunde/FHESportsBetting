# Vue Template for FHEVM

Vue.js template for building confidential dApps with FHEVM SDK.

## Framework-Agnostic SDK

The FHEVM SDK core is framework-agnostic and works seamlessly with Vue:

```javascript
import { createFhevmClient, initFhevm, encryptInput } from '@fhevm/sdk';

// In your Vue component
export default {
  async mounted() {
    const client = createFhevmClient({ provider, signer });
    await initFhevm(client);

    const encrypted = await encryptInput({
      values: [{ value: 100, type: 'euint32' }],
      contractAddress: '0x...',
      userAddress: address,
    });
  }
}
```

## Vue 3 Composition API

Use with Vue 3 Composition API for reactive state management:

```javascript
import { ref, onMounted } from 'vue';
import { createFhevmClient, initFhevm } from '@fhevm/sdk';

export default {
  setup() {
    const isInitialized = ref(false);
    const client = ref(null);

    onMounted(async () => {
      client.value = createFhevmClient({ provider, signer });
      await initFhevm(client.value);
      isInitialized.value = true;
    });

    return { isInitialized, client };
  }
}
```

## Documentation

- [Getting Started](../../docs/getting-started.md)
- [API Reference](../../docs/api-reference.md)
