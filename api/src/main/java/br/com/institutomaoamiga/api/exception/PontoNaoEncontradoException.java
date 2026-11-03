package br.com.institutomaoamiga.api.exception;

public class PontoNaoEncontradoException extends RuntimeException {

    public PontoNaoEncontradoException(Long id) {
        super("Ponto não encontrado: " + id);
    }
}
