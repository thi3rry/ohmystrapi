/**
 * Wait for an amount of seconds before resolve the promise
 * @param {number} seconds
 * @return {Promise<void>}
 */
export async function $wait(seconds) {
    return new Promise(res => {
        setTimeout(() => res(), seconds*1000);
    });
};
