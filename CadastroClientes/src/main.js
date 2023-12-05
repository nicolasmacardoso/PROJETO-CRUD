document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');
    const cadastroLink = document.getElementById('cadastroLink');
    const entrarLink = document.getElementById('entrarLink');
    const tableTitle = document.getElementById('tableTitle');
    const mudarTabela = document.getElementById('mudarTabela');
    const cadastrarButton = document.getElementById('cadastrarButton');
    const cadastrarNovoClienteButton = document.getElementById('cadastrarNovoClienteButton');
    const modalCliente = document.getElementById('modalCliente');
    const fecharModalCliente = document.getElementById('fecharModalCliente');

    // Adicione essa função para esconder o modal
    function fecharModal() {
        modalCliente.style.display = 'none';
    }

    // Adicione essa função para limpar os campos do formulário no modal
    function limparCamposModal() {
        // Adicione aqui a lógica para limpar os campos do formulário no modal
    }

    // Adicione essa função para abrir o modal
    function abrirModal() {
        modalCliente.style.display = 'block';
        // Adicione aqui a lógica necessária ao abrir o modal
    }

    // Adicione o evento de clique no botão "Cadastrar Novo Cliente"
    if (cadastrarNovoClienteButton) {
        cadastrarNovoClienteButton.addEventListener('click', () => {
            abrirModal();
        });
    }

    // Adicione o evento de clique no botão para fechar o modal
    if (fecharModalCliente) {
        fecharModalCliente.addEventListener('click', () => {
            fecharModal();
        });
    }

    // Adicione o evento para fechar o modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === modalCliente) {
            fecharModal();
            limparCamposModal(); // Limpar campos ao fechar o modal
        }
    });
    
    function redirectToEnderecos() {
        console.log('Redirecionando para Endereços...');
        // Lógica para abrir o formulário de cadastro de cliente
        tableTitle.textContent = 'ENDEREÇOS';
        mudarTabela.textContent = 'Clientes';
        cadastrarButton.textContent = 'Cadastrar novo endereço';
    
        enderecosTable.style.display = 'table';
        clientesTable.style.display = 'none';
    
        // Remover ouvinte de evento desnecessário
        mudarTabela.removeEventListener('click', redirectToEnderecos);
        // Adicionar ouvinte de evento após a atualização
        mudarTabela.addEventListener('click', redirectToClientes);
    
        // Outras operações necessárias ao mudar para o formulário de cadastro de cliente
    }
    
    function redirectToClientes() {
        console.log('Redirecionando para Clientes...');
        // Lógica para redirecionar para a visualização de endereços
        tableTitle.textContent = 'CLIENTES';
        mudarTabela.textContent = 'Endereços dos clientes';
        cadastrarButton.textContent = 'Cadastrar novo cliente ';
    
        clientesTable.style.display = 'table';
        enderecosTable.style.display = 'none';
    
        // Remover ouvinte de evento desnecessário
        mudarTabela.removeEventListener('click', redirectToClientes);
        // Adicionar ouvinte de evento após a atualização
        mudarTabela.addEventListener('click', redirectToEnderecos);
    
        // Outras operações necessárias ao redirecionar para a visualização de endereços
    }
    const salvarClienteButton = document.getElementById('salvarClienteButton');

    if (salvarClienteButton) {
        salvarClienteButton.addEventListener('click', () => {
            // Obter valores do formulário
            const nomeCompleto = document.getElementById('nomeCompleto').value;
            const cpf = document.getElementById('cpf').value;
            const dataNascimento = document.getElementById('dataNascimento').value;
            const telefone = document.getElementById('telefone').value;
            const celular = document.getElementById('celular').value;
    
            adicionarClienteATabela(nomeCompleto, cpf, dataNascimento, telefone, celular);
    
            resetFormFields([nomeCompleto, cpfInput, dataNascimento, telefone, celular]);
        });
    }
    
    function adicionarClienteATabela(nomeCompleto, cpf, dataNascimento, telefone, celular) {
        const tableBody = document.getElementById('clientesTableBody');
        const newRow = tableBody.insertRow();
        newRow.insertCell(0).textContent = nomeCompleto;
        newRow.insertCell(1).textContent = cpf;
        newRow.insertCell(2).textContent = dataNascimento;
        newRow.insertCell(3).textContent = telefone;
        newRow.insertCell(4).textContent = celular;
    }

    if (mudarTabela) {
        mudarTabela.addEventListener('click', redirectToEnderecos);
    }
    
    if (cadastroLink) {
        cadastroLink.addEventListener('click', (event) => {
            event.preventDefault();
            if (loginForm && cadastroForm) {
                loginForm.style.display = 'none';
                cadastroForm.style.display = 'block';
            }
        });
    }

    if (entrarLink) {
        entrarLink.addEventListener('click', (event) => {
            event.preventDefault();
            if (loginForm && cadastroForm) {
                loginForm.style.display = 'block';
                cadastroForm.style.display = 'none';
            }
        });
    }

    const SQL = await initSqlJs({
        locateFile: filename => `../node_modules/sql.js/dist/${filename}`
    });

    let db = loadDatabase();

    function loadDatabase() {
        const savedDb = localStorage.getItem('myDatabase');
        if (savedDb) {
            return new SQL.Database(new Uint8Array(JSON.parse(savedDb)));
        } else {
            const newDb = new SQL.Database();
            initializeDatabase(newDb);
            return newDb;
        }
    }

    function saveDatabase() {
        const dbData = db.export();
        const buffer = new Uint8Array(dbData);
        const serializedDb = JSON.stringify([...buffer]);
        localStorage.setItem('myDatabase', serializedDb);
    }

    const loginButton = document.getElementById('loginButton');
    const cadastroButton = document.getElementById('cadastroButton');

    hideErrorMessage('usuarioError');
    hideErrorMessage('senhaError');
    hideErrorMessage('novoUsuarioError');
    hideErrorMessage('novaSenhaError');
    hideErrorMessage('confirmarSenhaError');
    hideErrorMessage('userExistsError');
    hideErrorMessage('userInvalidError');

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            const usuario = document.getElementById('usuarioInput').value;
            const senha = document.getElementById('senhaInput').value;

            if (usuario.trim() === "") {
                displayErrorMessage('usuarioError', 'Usuário não pode ser vazio.');
                hideErrorMessage('userExistsError');
                hideErrorMessage('userInvalidError');
                return;
            } else {
                hideErrorMessage('usuarioError');
                hideErrorMessage('userExistsError');
                hideErrorMessage('userInvalidError');
            }

            if (senha.trim() === "") {
                displayErrorMessage('senhaError', 'Senha não pode ser vazia.');
                return;
            } else {
                hideErrorMessage('senhaError');
                hideErrorMessage('userExistsError');
                hideErrorMessage('userInvalidError');
            }

            const authenticated = authenticateUser(db, usuario, senha);

            if (authenticated) {
                showUsersList(db);
                window.location.href = 'home.html';
            }
            else {
                displayErrorMessage('userInvalidError', 'Usuário ou senha inválido.');
            }
        });
    }
    if (cadastroButton) {
        cadastroButton.addEventListener('click', () => {
            const novoUsuarioInput = document.getElementById('novoUsuarioInput');
            const novaSenhaInput = document.getElementById('novaSenhaInput');
            const confirmarSenhaInput = document.getElementById('confirmarSenhaInput');
        
            const novoUsuario = novoUsuarioInput.value;
            const novaSenha = novaSenhaInput.value;
            const confirmarSenha = confirmarSenhaInput.value;
        
            if (novoUsuario.trim() === "") {
                displayErrorMessage('novoUsuarioError', 'Usuário não pode ser vazio.');
                hideErrorMessage('userExistsError');
                hideErrorMessage('userInvalidError');
                return;
            } 
        
            if (novaSenha.length < 6) {
                displayErrorMessage('novaSenhaError', 'Senha deve ter pelo menos 6 caracteres.');
                hideErrorMessage('userExistsError');
                hideErrorMessage('userInvalidError');
                return;
            } else {
                hideErrorMessage('novaSenhaError');
                hideErrorMessage('userExistsError');
                hideErrorMessage('userInvalidError');
            }
        
            if (novaSenha != confirmarSenha) {
                displayErrorMessage('confirmarSenhaError', 'Senhas não coincidem.');
                hideErrorMessage('userExistsError');
                hideErrorMessage('userInvalidError');
                return;
            } else {
                hideErrorMessage('confirmarSenhaError');
                hideErrorMessage('userExistsError');
                hideErrorMessage('userInvalidError');
            }
        
            const userCreated = createUser(db, novoUsuario, novaSenha);
        
            if (userCreated) {
                showUsersList(db);
                saveDatabase(); 
                console.log('Usuário cadastrado com sucesso!');
                resetFormFields([novoUsuarioInput, novaSenhaInput, confirmarSenhaInput]);
                displaySuccessMessage('cadastroSuccessMessage');
            } else {
                displayErrorMessage('userExistsError', 'Esse nome de usuário já está sendo utilizado.');
                console.log('Erro ao cadastrar usuário. Tente novamente.');
            }
        });
    }
});

function resetFormFields(fields) {
    fields.forEach(field => {
        field.value = '';
    });
}

function displaySuccessMessage(id) {
    const successElement = document.getElementById(id);
    successElement.style.display = 'block';
    setTimeout(() => {
        successElement.style.display = 'none';
    }, 5000); 
}

function displayErrorMessage(id, message) {
    const errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideErrorMessage(id) {
    const errorElement = document.getElementById(id);

    // Adicione esta verificação
    if (errorElement !== null) {
        errorElement.textContent = "";
        errorElement.style.display = 'none';
    }
}

function initializeDatabase(db) {
    const createTableClientes = `
        CREATE TABLE IF NOT EXISTS Clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            idade INTEGER,
            cpf TEXT UNIQUE
        );
    `;

    const createTableEnderecos = `
        CREATE TABLE IF NOT EXISTS Enderecos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cep TEXT,
            rua TEXT,
            bairro TEXT,
            cidade TEXT,
            estado TEXT,
            pais TEXT,
            identificador_cliente INTEGER,
            principal BOOLEAN,
            FOREIGN KEY (identificador_cliente) REFERENCES Clientes(id)
        );
    `;

    // Adicione esta parte para criar a tabela de usuários
    const createTableUsuarios = `
        CREATE TABLE IF NOT EXISTS Usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT UNIQUE,
            senha TEXT
        );
    `;

    db.run(createTableClientes);
    db.run(createTableEnderecos);
    db.run(createTableUsuarios);
}

function authenticateUser(db, usuario, senha) {
    const query = "SELECT * FROM Usuarios;";
    const stmt = db.prepare(query);

    while (stmt.step()) {
        const user = stmt.getAsObject();
        if (user.usuario === usuario && user.senha === senha) {
            console.log(`Usuário autenticado com sucesso! Usuário: ${usuario}, Senha: ${senha}`);
            return true;
        }
    }

    console.log(`Usuário não encontrado ou senha incorreta para: ${usuario}`);
    return false;
}

function createUser(db, usuario, senha) {
    // Lógica de cadastro de novo usuário
    const insertQuery = `INSERT INTO Usuarios (usuario, senha) VALUES (?, ?);`;
    const stmt = db.prepare(insertQuery);

    try {
        stmt.bind([usuario, senha]);
        stmt.step();
        const rowsModified = db.getRowsModified();

        if (rowsModified > 0) {
            return true; // Cadastro bem-sucedido
        } else {
            return false; // Nenhuma linha modificada, cadastro falhou
        }
    } catch (error) {
        // Tratar erro de violação de restrição única
        if (error.message.includes('UNIQUE constraint failed: Usuarios.usuario')) {
            displayErrorMessage('userExistsError', 'Nome de usuário já existe.');
        } else {
            console.error(error);
        }

        return false; // Cadastro falhou devido ao erro
    }
}

function showUsersList(db) {
    const query = "SELECT * FROM Usuarios;";
    const stmt = db.prepare(query);

    const usersList = [];

    while (stmt.step()) {
        const user = stmt.getAsObject();
        usersList.push(user);
    }

    console.log("Lista de Usuários:", usersList);
}