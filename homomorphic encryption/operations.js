var nj = require('numjs')
var check = require('./type_check_js.js')
var encryption_core = require('./encryption_core.js')
var mh = require('./math_helper.js')

// # c' = c1 + c2
exports.secure_add_vectors = function(c1,c2){
    if(!check.check_is_vector(c1)){
        throw new Error("c1 is not a vector")
    }
    if(!check.check_is_vector(c2)){
        throw new Error("c2 is not a vector")
    }
    return c1.add(c2)
}

// # sc = wx + e
// # (Gs)c = wGx + Ge
// # Gsc = s'c'

// # client compute M.
// # g is not encoded. Client encode g using t
exports.secure_linear_transform_client = function(encryption_core,g,s,t){
    return encryption_core.key_switching_get_switching_matrix(nj.dot(g,s),t)
}

// # server compute c' = Mc
// # server knows w (private key)
exports.secure_linear_transform_server = function(encryption_core, c, m){
    encryption_core.key_switching_get_cipher_from_switching_matrix(c,m)
}

// # vec(s1 H s2) [c1c2/w] = w (x1hx2) + e
// # h is not encoded. Client encode h using t
exports.secure_inner_product_client = function(encryption_core, s1, s2, h, t){
    s = mh.vector_to_matrix(mh.matrix_to_vector(s1.T.dot(h).dot(s2)), 1, -1)
    switching_matrix = encryption_core.key_switching_get_switching_matrix(s, t)
    return switching_matrix
}

// # server computes inner product
// # server knows w (private key)
exports.secure_inner_product_server = function(encryption_core, c1, c2, m, w){
    c1_dot_c2 = c1.reshape(-1,1).dot(c2.reshape(1,-1))
    vec_c1_dot_c2 = mh.matrix_to_vector(c1_dot_c2)
    c = mh.round(vec_c1_dot_c2 / w)
    return encryption_core.key_switching_get_cipher_from_switching_matrix(c, m)
}
