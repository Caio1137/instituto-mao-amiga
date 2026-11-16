package br.com.institutomaoamiga.api.exception;

/** Lançada quando o id pedido não existe no banco; o ApiExceptionHandler responde 404. */
public class RecursoNaoEncontradoException extends RuntimeException {

    public RecursoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}
