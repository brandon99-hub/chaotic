// Auth circuit enforces knowledge of secret X such that g0 * X equals Y.
// g0 and Y are public inputs. X is private input supplied by the prover during witness generation.
template Auth() {
    signal input g0;
    signal input Y;
    signal private input X;

    // Direct constraint: g0 * X must equal Y
    g0 * X === Y;
}

component main = Auth();
