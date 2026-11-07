package ma.inpt.soa.service4candidaturesrest.rest;

import ma.inpt.soa.service4candidaturesrest.dao.CandidatureDAO;
import ma.inpt.soa.service4candidaturesrest.model.ApiError;
import ma.inpt.soa.service4candidaturesrest.model.Candidature;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.Map;

@Path("/candidatures")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
@Consumes(MediaType.APPLICATION_JSON)
public class CandidatureResource {

    private final CandidatureDAO dao = new CandidatureDAO();

    @GET
    public Response listerCandidatures(@QueryParam("statut") String statut, @QueryParam("etudiantId") Integer etudiantId) {
        System.out.println("[REST Service 4] GET /candidatures (statut=" + statut + ", etudiantId=" + etudiantId + ")");
        List<Candidature> liste;
        if (etudiantId != null && etudiantId > 0) {
            liste = dao.listerParEtudiant(etudiantId);
        } else if (statut != null && !statut.trim().isEmpty() && !statut.equalsIgnoreCase("ALL")) {
            liste = dao.listerParStatut(statut);
        } else {
            liste = dao.listerToutes();
        }
        return Response.ok(liste).build();
    }

    @GET
    @Path("/etudiant/{etudiantId}")
    public Response getCandidaturesParEtudiant(@PathParam("etudiantId") int etudiantId) {
        System.out.println("[REST Service 4] GET /candidatures/etudiant/" + etudiantId);
        List<Candidature> liste = dao.listerParEtudiant(etudiantId);
        return Response.ok(liste).build();
    }

    @GET
    @Path("/{id}")
    public Response getCandidature(@PathParam("id") int id) {
        System.out.println("[REST Service 4] GET /candidatures/" + id);
        Candidature c = dao.getById(id);
        if (c != null) {
            return Response.ok(c).build();
        }
        return Response.status(Response.Status.NOT_FOUND)
                .entity(new ApiError(404, "Candidature #" + id + " introuvable"))
                .build();
    }

    @POST
    public Response deposerCandidature(Candidature candidature) {
        System.out.println("[REST Service 4] POST /candidatures");
        if (candidature == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ApiError(400, "Le corps de la requête est vide ou invalide."))
                    .build();
        }

        try {
            Candidature nouvelle = dao.deposerCandidature(candidature);
            if (nouvelle != null) {
                return Response.status(Response.Status.CREATED).entity(nouvelle).build();
            } else {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity(new ApiError(500, "Erreur interne lors de l'enregistrement de la candidature."))
                        .build();
            }
        } catch (IllegalStateException e) {
            // Conflit / Doublon
            return Response.status(Response.Status.CONFLICT)
                    .entity(new ApiError(409, e.getMessage()))
                    .build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ApiError(400, e.getMessage()))
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ApiError(500, e.getMessage()))
                    .build();
        }
    }

    @PATCH
    @Path("/{id}/statut")
    public Response changerStatut(@PathParam("id") int id, Map<String, String> body, @QueryParam("statut") String statutParam) {
        System.out.println("[REST Service 4] PATCH /candidatures/" + id + "/statut");

        String nouveauStatut = null;
        if (body != null && body.containsKey("statut")) {
            nouveauStatut = body.get("statut");
        } else if (statutParam != null && !statutParam.trim().isEmpty()) {
            nouveauStatut = statutParam;
        }

        if (nouveauStatut == null || nouveauStatut.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ApiError(400, "Le paramètre 'statut' est requis."))
                    .build();
        }

        Candidature existante = dao.getById(id);
        if (existante == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ApiError(404, "Candidature #" + id + " introuvable."))
                    .build();
        }

        try {
            boolean succes = dao.changerStatut(id, nouveauStatut);
            if (succes) {
                existante.setStatut(nouveauStatut);
                return Response.ok(existante).build();
            } else {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity(new ApiError(500, "Échec de la mise à jour du statut en base de données."))
                        .build();
            }
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ApiError(400, e.getMessage()))
                    .build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response supprimerCandidature(@PathParam("id") int id) {
        System.out.println("[REST Service 4] DELETE /candidatures/" + id);
        Candidature existante = dao.getById(id);
        if (existante == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ApiError(404, "Candidature #" + id + " introuvable."))
                    .build();
        }

        try {
            boolean ok = dao.supprimerCandidature(id);
            if (ok) {
                return Response.noContent().build();
            }
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ApiError(500, "Échec de la suppression de la candidature."))
                    .build();
        } catch (IllegalStateException e) {
            return Response.status(Response.Status.CONFLICT)
                    .entity(new ApiError(409, e.getMessage()))
                    .build();
        }
    }
}
