package br.com.institutomaoamiga.api.exception;

import br.com.institutomaoamiga.api.dto.ErroResponseDTO;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.data.core.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.stream.Collectors;

@RestControllerAdvice
public class ApiExceptionHandler {

    /** Bean Validation do @Valid: junta as mensagens dos campos inválidos. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponseDTO> dadosInvalidos(MethodArgumentNotValidException ex) {
        String mensagem = ex.getBindingResult().getFieldErrors().stream()
                .map(erro -> erro.getDefaultMessage())
                .distinct()
                .sorted()
                .collect(Collectors.joining(" "));
        return erro(HttpStatus.BAD_REQUEST, mensagem);
    }

    /** JSON malformado ou com tipo errado (ex.: quantidade 1.5 ou "abc"). */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroResponseDTO> jsonInvalido(HttpMessageNotReadableException ex) {
        return erro(HttpStatus.BAD_REQUEST, "JSON inválido. Confira os campos e os tipos enviados.");
    }

    /** Id que não é UUID ou parâmetro de página com valor errado. */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErroResponseDTO> parametroInvalido(MethodArgumentTypeMismatchException ex) {
        return erro(HttpStatus.BAD_REQUEST, "Valor inválido para o parâmetro " + ex.getName() + ".");
    }

    /**
     * sort=campoQueNaoExiste na URL. Nas consultas com @Query o Hibernate só percebe o campo
     * errado ao montar o ORDER BY e lança InvalidDataAccessApiUsageException.
     */
    @ExceptionHandler({PropertyReferenceException.class, InvalidDataAccessApiUsageException.class})
    public ResponseEntity<ErroResponseDTO> ordenacaoInvalida(Exception ex) {
        return erro(HttpStatus.BAD_REQUEST, "Campo de ordenação inválido. Use um dos campos da resposta, ex.: sort=nome,asc.");
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResponseDTO> naoEncontrado(RecursoNaoEncontradoException ex) {
        return erro(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    private ResponseEntity<ErroResponseDTO> erro(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status).body(new ErroResponseDTO(status.value(), mensagem));
    }
}
