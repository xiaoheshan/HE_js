var nj=require('numjs')
var assert=require('assert')
var mh=require('./math_helper')
var ec=require('./encryption_core')


var encryption_core,w,scale,t_bound,input_range;


class Encryption{


     constructor(encryption_core,w,_scale,t_bound,input_range){
        this.encryption_core=encryption_core
        this.w=_w
        this.scale=scale
        this.t_bound=t_bound
        this.input_range=input_range;
    }

    load_t_cache(){
        t_cache=[]
        for(var i=0;i<w.size;i++){
            t_cache.push(mh.generate_random_array(i,1,this.t_bound))
        }
        return t_cache
    }

    load_s_cache(){
        s_cache=[]
        for(var i=0;i<this.t_cache.length;i++){
            s_cache.push(ec.key_switching_get_secret(t_cache[i]))
        }
        return s_cache

    }


    get_t(size){
        if(size>=this.input_range){
            console.error("size %d exceeded input range %d",size,this.input_range)
        }else{
            return this.t_cache[size]
        }
    }

    get_s(size){
        if(size>=this.input_range){
            console.error("size %d exceeded input range %d",size,this.input_range)
        }else{
            return this.s_cache[size]
        }
    }

    encrypt_vector(vector){
        vector=mh.round(nj.multiply(nj.array(vector),scale))
        s0=ec.naive_encrypt_secret(this.w,vector.size)
        c0=vector
        t1=this.get_t(vector.size)
        c1=ec.key_switching_get_cipher(c0,s0,t1)
        return c1
    }

    decrypt_vector(cipher){
        secret=this.get_s(cipher.length-1)
        result=ec.decrypt(secret,cipher,this.w)
        return nj.array(result).divide(parseFloat(this.scale))
    }

    encrypt_number(number){
        x=nj.array(number)
        cipher=this.encrypt_vector(x)
        return cipher
    }

    decrypt_number(cipher){
        result=ec.decrypt(this.get_s(1),cipher,this.w)
        return result/parseFloat(this.scale)
    }

    encrypt_matrix(matrix){
        matrix=mh.round(nj.multiply(nj.array(matrix),this.scale))
        column_size= matrix.shape[1]
        s0=ec.naive_encrypt_secret(this.w,column_size)
        t1=this.get_t(column_size)
        encrypted_matrix=[]
        for(var i=0;i<matrix.length;i++){
            encrypted_matrix.push(ec.key_switching_get_cipher(nj.array(matrix[i].reshape(-1),s0,t1)))
        }
        return encrypted_matrix
    }


    decrypt_matrix(cipher){
        result=ec.decrypt(this.get_s(cipher.shape[1]-1),cipher,this.w)
        return nj.array(result).divide(parseFloat(this.scale))
    }

    static add(cipher1,cipher2){
        assert.strictEqual(cipher1.shape,cipher2.shape)
        nj.add(nj.array(cipher1),nj.array(cipher2))
    }

    static subtract(cipher1,cipher2){
        assert.strictEqual(cipher1.shape,cipher2.shape)
        nj.subtract(nj.array(cipher1),nj.array(cipher2))
    }

    static multiply_scalar(cipher,number){
        return mh.round(nj.array(nj.multiply(cipher,parseFloat(number))))
    }

    static divide_scalar(cipher,number){
        return  mh.round(nj.array(nj.divide(cipher,parseFloat(number))))
    }


    //need operation.js
    weighted_inner_product(cipher1,h,cipher2){
        secret1=this.get_s(cipher1.length-1)
        secret2=this.get_s(cipher2.length-1)
        
    }

    //need operation.js
    linear_transform(g,cipher){

    }

    static one_hot_transform(number_cipher,total_elements,element_index){
       
    }


    transpose(encrypted_matrix){

    }

    exponential(x){



    }

    cipher_list_to_cipher_vector(cipher_list){

    }

    exponential_vector(vector){

    }

    softmax(vector){

    }

    outer_product(cipher1,cipher2){

    }

    sum(vector_cipher){

    }


}






































